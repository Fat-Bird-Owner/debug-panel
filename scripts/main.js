const panel = require("dbm/command");

Events.on(ClientLoadEvent, () => {
try{

    let overlaymarkerTable = Vars.ui.hudGroup.find("statustable");
    overlaymarkerTable.row();

    let tab = new Table();
    overlaymarkerTable.add(tab).bottom().left();

    tab.table(Tex.pane, t => {
        let b = new Button(Styles.none);
        let icon = new TextureRegionDrawable(Core.atlas.find("dbm-command-block"));
        b.button(icon, () => {

        });
        t.add(b);

        t.clicked(() => {
        try{
        panel.panel();
        } catch(e){
       Vars.ui.showInfoToast(e,15);
        }});
    });

    tab.visibility = () => {
        // return (Vars.ui.hudfrag.shown && Vars.mobile && !Vars.net.client() ? true : false)
        return (Vars.ui.hudfrag.shown && !Vars.net.client() ? true : false)
    }

} catch(e){
Vars.ui.showInfoToast(e,15);
}});
