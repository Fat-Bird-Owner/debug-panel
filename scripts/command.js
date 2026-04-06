function panel(){
        
        const build = Vars.player;

        if (!build) return;
        const buildTeam = build.team();

        Sounds.click.at(build.x, build.y);

        Vars.ui.showMenu(
            "<Commands List>",
            "[lightgrey]Free will at last. [red]<Crashes is possibles>[]",
            [
                ["Clear Units"],
                ["Stop Player"],
                ["Change Team"],
                ["Toggle canGameover"],
                ["Toggle Editor"],
                ["Toggle disableUnitCap"],
                ["Spawn Unit"],
                ["Get Current Unit"],
                ["Unit Library [grey]<Vanilla Only>[]"],
                ["Fill Core"],
                ["Run Javascript"],
                ["Close"]
            ],
            i => {

                if (i == 0) {

                    Sounds.uiButton.play();
                    Groups.unit.clear();
                    Vars.ui.hudfrag.showToast(Icon.tree, "[green]All units cleared");

                } else if (i == 1) {
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

                } else if (i == 2) {
                    try {

                        Vars.ui.showTextInput("Change Team", "Enter team id", 100, lastUnit, true, text => {
                        try{

                        Sounds.uiButton.play();
                        const p = Vars.player;
                        if (!p) {
                            Vars.ui.showInfoToast("Wheres the player vro.", 3);
                            return;
                        }

                        const currentTeam = p.team();
                        const newTeam = Team.get(text);

                        p.team(newTeam);
                        Vars.ui.hudfrag.showToast(Icon.tree, "[accent]Team changed");

                        } catch(e){
                        Vars.ui.showInfoToast(e,10);
                        }});

                    } catch (err) {
                        Vars.ui.showInfoToast(String(err), 15);
                    }} else if (i == 3){
                        try{

                    Sounds.uiButton.play();
                    const gameOver = Vars.state.rules.canGameOver;
                    Vars.state.rules.canGameOver = !gameOver;

                    Vars.ui.hudfrag.showToast(Icon.tree, "[accent]Toggled canGameOver: [lightgrey]" + !gameOver);
                        
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);    
                    }} else if (i == 4){
                        try {

                    const editor = Vars.state.rules.editor;
                    Vars.state.rules.editor = !editor;

                    Vars.ui.hudfrag.showToast(Icon.tree, "[accent]Toggled editor: [lightgrey]" + !editor);
                             
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);  
                    }} else if (i == 5){
                        try{

                    Sounds.uiButton.play();
                    const disableUnitCap = Vars.state.rules.disableUnitCap;
                    Vars.state.rules.disableUnitCap = !disableUnitCap;

                    Vars.ui.hudfrag.showToast(Icon.tree, "[accent]Toggled disableUnitCap: [lightgrey]" + !disableUnitCap);
                            
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }} else if (i == 6){
                        try{

                    Sounds.uiButton.play();
                    Vars.ui.showTextInput("SpawnUnit", "Enter unit's internal name (modName-fileName)", 100, lastUnit, false, text => {
                        try{
                    lastUnit = text;
                    const unit = Vars.content.getByName(ContentType.unit, text);

                    if (unit == null){
                    Vars.ui.hudfrag.showToast(Icon.chat,"[red]Unit Invalid[]");
                    return;
                    }
                        
                    unit.spawn(buildTeam,build.x,build.y,90);
                    Sounds.waveSpawn.at(build.x,build.y);
                    Fx.spawn.at(build.x,build.y);
                            
                    Vars.ui.hudfrag.showToast(Icon.chat, "[accent]Spawned in a(n) []" + unit.localizedName);

                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }});

                            

                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }} else if (i == 7){
                        try{

                    Sounds.uiButton.play();
                    const unit = Vars.player.unit();
                    if (!unit) return;
                    const type = unit.type.name;
                    lastUnit = type;
                    Vars.ui.hudfrag.showToast(Icon.eye,"[lightgrey]Copied to spawn unit");
                            
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }} else if(i == 8){
                    try{

                    Sounds.uiButton.play();
                    var units = [];
                        
                   Object.keys(UnitTypes).forEach(unit => {
                    try{
                    if (unit != null || unit != "load"){
                    units.push(unit);
                    }} catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }});

                    Vars.ui.showStartupInfo(units.join(" "));
                    
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }} else if(i == 9){

                    Sounds.uiButton.play();
                    let core = Vars.player.core();
                    let amount = 0;
                    
                    Vars.content.items().each(item => {
                    try{
                        
                    core.items.set(item, core.storageCapacity);
                    amount++;
                    } catch(e){
                    Vars.ui.showInfoToast(e,15);
                    }});

                    Vars.ui.hudfrag.showToast(Icon.effect,"[accent]Filled core with []" + amount + "[accent] different items");
                    
                    } else if (i == 10){
                    try{

                    Sounds.uiButton.play();
                    Vars.ui.showTextInput("<Run Javascript>", "May break the game depending on the script", 100, lastCommand, false, text => {
                    try{      

                    const error = "[red]Error Found";
                    lastCommand = text;
                    eval("try{ " + text + "} catch(e) { Vars.ui.showText(error,e)}");
                    
                    Sounds.waveSpawn.play();
                    Vars.ui.hudfrag.showToast(Icon.chat, "[accent]Ran: []" + text);
                    
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }});
                        
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);       
                    }}
            }
        );

}

module.exports = {
panel: panel
};
