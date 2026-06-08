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

block.health = 200000000;
block.targetable = false;
block.underBullets = true;
block.envEnabled = -1;
block.explosivenessScale = 0;
block.flammabilityScale = 0;
block.enableDrawStatus = false;
  
block.stats.remove(Stat.productionTime);
block.stats.remove(Stat.output);
}

} catch(e){
Vars.ui.showText("", e);
}});
