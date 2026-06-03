var lastUnit = "";
var lastCommand = "";
var lastTeam = 1;
var consolePanel = null;
var value = 0;
var unitsTab = null;
var timeScaleDialog = null;
var speed = 1;
var lastMap = null;
var table = null;
var regionTab = null;

// ==========================================
// MENU COMMAND FUNCTIONS
// ==========================================

function clearUnits() {
    Sounds.uiButton.play();
    Groups.unit.clear();
    Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.clear-units"));
}

function stopPlayer() {
    try {
        Sounds.uiButton.play();
        const p = Vars.player;
        if (!p) {
            Vars.ui.hudfrag.showToast(Icon.tree, "[grey]Player does not exist.");
            return;
        }
        const unit = p.unit();
        if (!unit) {
            Vars.ui.hudfrag.showToast(Icon.tree, "[grey]No unit found");
            return;
        }
        unit.apply(StatusEffects.unmoving, 9999 * 60);
        Vars.ui.hudfrag.showToast(Icon.tree, "[grey]Stopped player unit");
    } catch (err) {
        Vars.ui.showInfoToast("err: " + err, 5);
    }
}

function changeTeam() {
    try {
        const teams = Team.all;
        const dialog = new BaseDialog("dialog");
        let count = 0;

        let width = Core.graphics.getWidth() * 0.085;
        let height = Core.graphics.getHeight() * 0.085;

        dialog.cont.pane(p => {
            for (let i = 0; i < teams.length; i++) {
                let team = teams[i];
                const button = new Button(Styles.squareTogglet);
                button.image(Tex.whiteui).size(60).color(team.color);
                button.row();
                button.add(team.coloredName());

                button.clicked(() => {
                    try {
                        const player = Vars.player;
                        player.team(team);
                        dialog.hide();
                    } catch (e) {
                        Vars.ui.showInfoToast(e, 5);
                    }
                });

                p.add(button).size(width, height).padTop(10);
                p.add().width(10);
                count++;

                if (count >= 5) {
                    p.row();
                    count = 0;
                }
            }
        }).grow();

        dialog.addCloseButton();
        dialog.show();
    } catch (err) {
        Vars.ui.showInfoToast(String(err), 15);
    }
}

function toggleGameOver() {
    try {
        Sounds.uiButton.play();
        const gameOver = Vars.state.rules.canGameOver;
        Vars.state.rules.canGameOver = !Vars.state.rules.canGameOver;
        Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-cancanover") + "[lightgrey] " + !Vars.state.rules.canGameOver);
    } catch (e) {
        Vars.ui.showInfoToast(e, 5);
    }
}

function toggleEditor() {
    try {
        const editor = Vars.state.rules.editor;
        Vars.state.rules.editor = !editor;
        Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-editor") + "[lightgrey]" + !editor);
    } catch (e) {
        Vars.ui.showInfoToast(e, 5);
    }
}

function toggleUnitCap() {
    try {
        Sounds.uiButton.play();
        const disableUnitCap = Vars.state.rules.disableUnitCap;
        Vars.state.rules.disableUnitCap = !disableUnitCap;
        Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-disable-unitcap") + "[lightgrey]" + !disableUnitCap);
    } catch (e) {
        Vars.ui.showInfoToast(e, 10);
    }
}

function openUnitLibrary() {
    try {
        const build = Vars.player;
        if (!build) return;

        Sounds.uiButton.play();
        if (unitsTab == null) {
            unitsTab = new BaseDialog("Units");
            unitsTab.cont.add(Core.bundle.format("commandBlock.dialog.unitLib.info")).top().row();
            let count = 0;

            unitsTab.cont.pane(p => {
                Vars.content.units().each(unit => {
                    try {
                        if (unit == null || unit.internal) return;

                        let width = Core.graphics.getWidth() * 0.15;
                        let height = Core.graphics.getHeight() * 0.15;
                        if (height > width) height = Core.graphics.getHeight() * 0.05;

                        const button = new Button(Styles.squareTogglet);
                        button.image(unit.uiIcon).size(40).pad(12);
                        button.row();
                        button.add(unit.localizedName);

                        button.clicked(() => {
                            unit.spawn(build.team(), build.x, build.y, build.unit().rotation || 0);
                            Sounds.waveSpawn.play();
                        });

                        p.add(button).size(width, height).padTop(10);
                        p.add().width(10);
                        count++;
                        if (count % 3 == 0) {
                            p.row();
                        }
                    } catch (e) {
                        Vars.ui.showInfoToast(e, 5);
                    }
                });
            }).width(Core.graphics.getWidth()).growY();
            unitsTab.addCloseButton();
        }
        unitsTab.show();
    } catch (e) {
        Vars.ui.showInfoToast(e, 10);
    }
}

function fillCore() {
    Sounds.uiButton.play();
    let core = Vars.player.core();
    let amount = 0;

    Vars.content.items().each(item => {
        try {
            core.items.set(item, core.storageCapacity);
            amount++;
        } catch (e) {
            Vars.ui.showInfoToast(e, 15);
        }
    });
    Vars.ui.hudfrag.showToast(Icon.effect, Core.bundle.format("commandblock.showtoast.fill-core-1") + amount + Core.bundle.format("commandblock.showtoast.fill-core-2"));
}

function runJavaScript() {
    try {
        Sounds.uiButton.play();
        if (consolePanel == null) {
            let consoleTable = null;

            consolePanel = new BaseDialog(Core.bundle.format("commandblock.commands.run-javascript"));
            consolePanel.cont.top().row();

            const field = new TextField("");
            field.setMessageText("Insert Command");
            consolePanel.cont.add(field).growX();

            const button = new Button();
            button.add("Use");

            const clearButton = new Button();
            clearButton.add("clear");

            consolePanel.cont.add(button);
            consolePanel.cont.add(clearButton);
            consolePanel.cont.row().row();

            consolePanel.cont.pane(p => {
                consoleTable = new Table();
                consoleTable.background(Tex.button);
                p.add(consoleTable).grow();
            }).grow();

            function output(string) {
                try {
                    if (!consoleTable) return;
                    consoleTable.add(string).row();
                } catch (e) {
                    Vars.ui.showInfoToast(e, 5);
                }
            }

            button.clicked(() => {
                try {
                    const code = eval(field.getText());
                    output("[accent]ran:[] " + field.getText() + " [grey](" + code + ")");
                } catch (e) {
                    output("[red]" + String(e));
                }
            });

            clearButton.clicked(() => {
                try {
                    consoleTable.clear();
                } catch (e) {
                    Vars.ui.showInfoToast(e, 5);
                }
            });

            consolePanel.addCloseButton();
        }
        consolePanel.show();
    } catch (e) {
        Vars.ui.showInfoToast(e, 10);
    }
}

function openStatusEffects() {
    const dialog = new BaseDialog("dialog");
    let count = 0;
    let width = Core.graphics.getWidth() * 0.075;
    let height = Core.graphics.getHeight() * 0.075;

    const slider = new Slider(0, 325, 1, false);
    const label = new Label(String(value));

    slider.changed(() => {
        value = Math.floor(slider.getValue());
        if (value >= 305) {
            value = Infinity;
        }
        label.setText(String(value));
    });

    dialog.cont.add(slider).width(350).row();
    dialog.cont.add(label).row();

    dialog.cont.pane(p => {
        Vars.content.statusEffects().each(e => {
            const button = new Button(Styles.squareTogglet);
            button.image(e.uiIcon).size(60);
            button.row();
            button.add(e.name).left();

            button.clicked(() => {
                try {
                    const player = Vars.player;
                    player.unit().apply(e, value * 60);
                } catch (e) {
                    Vars.ui.showInfoToast(e, 5);
                }
            });

            p.add(button).size(width, height).padTop(10);
            p.add().width(10);
            count++;

            if (count >= 6) {
                p.row();
                count = 0;
            }
        });
    }).grow();

    dialog.addCloseButton();
    dialog.show();
}

function openTimeScale() {
    try {
        if (Vars.mods.getMod("tc") != null) {
            Vars.ui.showInfoToast("Time control is active not taking effect", 5);
            return;
        }

        if (timeScaleDialog == null) {
            timeScaleDialog = new BaseDialog(Core.bundle.format("commandBlock.timescale"));

            const slider = new Slider(0, 9, 0.05, false);
            const button = new Button();
            const label = new Label("1.00");

            button.add(new Image(Icon.play));

            Time.setDeltaProvider(() => {
                return Core.graphics.getDeltaTime() * 60 * speed;
            });

            slider.changed(() => {
                try {
                    speed = slider.getValue() + 1;
                    label.setText(speed.toFixed(2));
                } catch (e) {
                    Vars.ui.showInfoToast(e, 5);
                }
            });

            button.clicked(() => {
                speed = 1;
                slider.setValue(0);
                label.setText(speed.toFixed(2));
            });

            timeScaleDialog.cont.add(slider).width(150);
            timeScaleDialog.cont.add().width(15);
            timeScaleDialog.cont.add(label);
            timeScaleDialog.cont.add().width(15);
            timeScaleDialog.cont.add(button);
            timeScaleDialog.addCloseButton();
        }
        timeScaleDialog.show();
    } catch (e) {
        Vars.ui.showInfoToast(e, 5);
    }
}

function openPatcher() {
    try {
        const dialog = new BaseDialog("patcher");
        const patcher = Vars.state.patcher;
        const patches = patcher.patches;
        var count = 0;

        dialog.addCloseButton();

        dialog.cont.pane(p => {
            for (let i = 0; i < patches.size; i++) {
                const set = patches.get(i);
                const button = new Button();

                let name = set.name != "" ? set.name : "[grey]Unnamed";
                button.add(name);

                button.clicked(() => {
                    try {
                        dialog.hide();
                        Vars.ui.showTextInput("datapatcher", "Input content name", 9999, "", false, text => {
                            try {
                                var content = Vars.content.block(text) || Vars.content.unit(text) || Vars.content.statusEffect(text) || Vars.content.planet(text) || Vars.content.sector(text);

                                if (!content) {
                                    Vars.ui.hudfrag.showToast(text + " [red]Not found");
                                    return;
                                }

                                const patchScreen = new BaseDialog("patcher");
                                patchScreen.addCloseButton();

                                patchScreen.cont.pane(p => {
                                    let count = 0;
                                    for (let k in content) {
                                        const type = content[k];
                                        const property = k;

                                        if (typeof type != "function" && typeof type != "object") {
                                            const label = new Label(k + "\n[grey](" + typeof type + ":[] " + type + "[grey])[]");

                                            p.button(label, () => {
                                                if (typeof type == "boolean") {
                                                    set.add("\n" + content + "." + property + ":" + String(!type));
                                                    label.setText(k + "\n[grey](" + typeof type + ":[] " + type + "[grey])[]");
                                                }
                                            }).size(200, 80).padTop(10);
                                            p.add().width(10);
                                            count++;
                                        }
                                        if (count % 3 === 0) p.row();
                                    }
                                }).grow();

                                patchScreen.show();
                            } catch (e) {
                                Vars.ui.showInfoToast(e, 5);
                            }
                        });
                    } catch (e) {
                        Vars.ui.showInfoToast(e, 5);
                    }
                });

                p.add(button).growX().height(150);
                count++;

                if (count >= 3) {
                    p.row();
                    count = 0;
                }
            }
        }).grow();

        const newPatch = new Button();
        newPatch.image(Icon.add).size(60);
        newPatch.add().width(5);
        newPatch.add("New patch");
        dialog.cont.row();
        dialog.cont.add(newPatch);

        newPatch.clicked(() => {
            try {
                const seq = new Seq();
                for (let i = 0; i < patches.size; i++) {
                    const p = patches.get(i);
                    seq.add(p.patch);
                }
                seq.add("name: New patch");

                patcher.apply(seq);
                Vars.ui.hudfrag.showToast(Icon.add, "Added new patch file");
                dialog.hide();
            } catch (e) {
                Vars.ui.showInfoToast(e, 5);
            }
        });

        dialog.show();
    } catch (e) {
        Vars.ui.showInfoToast(e, 5);
    }
}

function generatePixMap() {
try{
    
    if (Vars.state.map != lastMap) {
        lastMap = Vars.state.map;

        const w = Vars.world.width();
        const h = Vars.world.height();
        const scale = 1;
        const pixmap = new Pixmap(Math.floor(w / scale), Math.floor(h / scale));

        for (let x = 0; x < w / scale; x++) {
            for (let y = 0; y < h / scale; y++) {
                const tile = Vars.world.tile(x * scale, y * scale);
                if (!tile) continue;

                let color = Color.darkGray;

                if (tile.overlay() != null && tile.overlay().itemDrop != null) {
                    color = (tile.block() == Blocks.air) ? tile.overlay().itemDrop.color : Color.lime;
                } else if (tile.block().solid) {
                    color = tile.block().mapColor;
                } else {
                    color = tile.floor().mapColor;
                }

                pixmap.set(x, pixmap.getHeight() - y - 1, color.rgba());
            }
        }

        const texture = new Texture(pixmap);
        const image = new Image(new TextureRegion(texture));
        const x = Core.graphics.getWidth() * 0.40;

        table = new BaseDialog("Map");
        table.addCloseButton();
        table.cont.add(image).size(x, x);
    }
    table.show();
    
} catch(e){
}}

function openEffects() {
    const d = Vars.ui.effects.withAllEffects();
    d.show();
}

function runUnitAI() {
    Vars.ui.hudfrag.showToast(Icon.admin, Core.bundle.format("commandblock.showtoast.unitAI"));

    if (!Vars.player || !Vars.player.team()) return;
    Groups.unit.each(u => {
        try {
            if (u.team != Vars.player.team() || u == Vars.player.unit()) return;
            if (u.type.flying) u.controller(new FlyingAI());
            else u.controller(new GroundAI());
        } catch (e) {
            Vars.ui.showInfoToast(e, 5);
        }
    });
}

function openTextureAtlas() {
    try {
        if (regionTab == null) {
            regionTab = new BaseDialog("Texture Atlas");
            regionTab.cont.add("Atlas Regions").top().row();
            let count = 0;

            regionTab.cont.pane(p => {
                const regions = Core.atlas.getRegions();
                regions.each(region => {
                    try {
                        if (region == null) return;
                        if (region.found && !region.found()) return;

                        let width = Core.graphics.getWidth() * 0.15;
                        let height = Core.graphics.getHeight() * 0.15;
                        if (height > width) height = Core.graphics.getHeight() * 0.05;

                        const button = new Button(Styles.squareTogglet);
                        button.add(new Image(region)).size(40).pad(12);
                        button.row();
                        button.add(String(region.name));

                        button.clicked(() => {
                            try {
                                Core.app.setClipboardText(String(region.name));
                                Vars.ui.showInfoToast(String(region.name), 3);
                            } catch (e) {
                                Vars.ui.showInfoToast(String(e), 5);
                            }
                        });

                        p.add(button).size(width, height).padTop(10);
                        p.add().width(10);
                        count++;

                        if (count % 3 == 0) p.row();
                    } catch (e) {
                        Vars.ui.showInfoToast(String(e), 5);
                    }
                });
            }).width(Core.graphics.getWidth() * 0.75).growY();

            regionTab.addCloseButton();
        }
        regionTab.show();
    } catch (e) {
        Vars.ui.showInfoToast(String(e), 5);
    }
}

function openSounds() {
    const dialog = new BaseDialog("dialog");
    let count = 0;
    let width = Core.graphics.getWidth() * 0.17;
    let height = Core.graphics.getHeight() * 0.17;

    dialog.cont.pane(p => {
        Object.keys(Sounds).forEach(s => {
            if (typeof s == "function" || typeof s == "object") return;
            
            let sound = s;
            const button = new Button(Styles.squareTogglet);
            button.row();
            button.add(sound);

            button.clicked(() => {
                try {
                    Core.audio.play(Sounds[s], 1, 1, 1, false);
                    Vars.ui.showInfoToast(s, 5);
                } catch (e) {
                    Vars.ui.showInfoToast(e, 5);
                }
            });

            p.add(button).size(width, height).padTop(10);
            p.add().width(10);
            count++;

            if (count >= 3) {
                p.row();
                count = 0;
            }
        });
    }).grow();

    dialog.addCloseButton();
    dialog.show();
}

function emojis(){
try {

const dialog = new BaseDialog("emoji");

dialog.addCloseButton();

dialog.cont.pane(p => {

    let buttons = 0;

    for(let i in Iconc){

        const icon = String.fromCharCode(Iconc[i]);

        const button = new Button();

        button.add(icon);

        button.clicked(() => {

            Core.app.setClipboardText(icon);

            Vars.ui.showInfoToast(
                "Copied: " + icon,
                2
            );

        });

        p.add(button)
            .size(128, 128);

        buttons++;

        if(buttons >= 7){

            p.row();
            buttons = 0;

        }

    }

}).grow();

dialog.show();
    
} catch(e){
Vars.ui.showInfoToast(e,5);    
}}

// ==========================================
// EXPORTS ALL FUNCTIONS
// ==========================================

exports.clearUnits = clearUnits;
exports.stopPlayer = stopPlayer;
exports.changeTeam = changeTeam;
exports.toggleGameOver = toggleGameOver;
exports.toggleEditor = toggleEditor;
exports.toggleUnitCap = toggleUnitCap;
exports.openUnitLibrary = openUnitLibrary;
exports.fillCore = fillCore;
exports.runJavaScript = runJavaScript;
exports.openStatusEffects = openStatusEffects;
exports.openTimeScale = openTimeScale;
exports.openPatcher = openPatcher;
exports.generatePixMap = generatePixMap;
exports.openEffects = openEffects;
exports.runUnitAI = runUnitAI;
exports.openTextureAtlas = openTextureAtlas;
exports.openSounds = openSounds;
exports.emojis = emojis;
