const panel = require("dbp/command");

Events.on(ClientLoadEvent, () => {
try{

    let overlaymarkerTable = Vars.ui.hudGroup.find("overlaymarker");
    overlaymarkerTable.row();

    let tab = new Table();
    overlaymarkerTable.add(tab).bottom().left();

    tab.table(Tex.pane, t => {
        let b = new Button(Styles.none);
        let lab = new Label("[accent]" + Core.bundle.format("commandblock.title"));
        let icon = new TextureRegionDrawable(Core.atlas.find("gr-command-block-modern"));
        b.button(icon, () => {

        });

        t.add(lab).row();
        t.add(b);

        t.clicked(() => {
        try{
        panel.panel();
        } catch(e){
        Vars.ui.showInfoToast(e,15);
        }});
    });

    tab.visibility = () => {
        return (!Vars.net.client() ? true : false)
    }

} catch(e){
Vars.ui.showInfoToast(e,15);
}});
