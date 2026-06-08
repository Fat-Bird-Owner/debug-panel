Events.on(ContentInitEvent, () => {
try{
const block = Vars.content.block("dbp-infini-fluid-source");
  
let array = [];  
Vars.content.liquids().each(liquid => {
try {          
array.push(new LiquidStack(liquid, 10));     
} catch(e) {} 
}); 
  
block.outputLiquids = array;
  
const omni = Vars.content.block("dbp-infini-omni-source");
omni.outputLiquids = array;
  
} catch(e){
Vars.ui.showText("e", e);  
}});
