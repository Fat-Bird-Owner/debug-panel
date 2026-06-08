const blocks = [
"dbp-infini-fluid-source",
"dbp-infini-source",
"dbp-infini-omni-source"
]

Events.on(ClientLoadEvent, () => {
try {

for (let i = 0; i < blocks.length; i++){
const block = Vars.content.block(blocks[i]);
Vars.ui.content.show(block);
Vars.ui.content.hide();

block.stats.remove(Stat.productionTime);
block.stats.remove(Stat.output);
}

} catch(e){
Vars.ui.showText("", e);
}});
