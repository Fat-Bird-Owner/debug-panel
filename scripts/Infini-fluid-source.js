Events.on(ContentInitEvent, () => {
try{
const block = Vars.content.block("dbp-infini-fluid-source");
  
let array = [];  
Vars.content.liquids().each(liquid => {
try {          
array.push(new LiquidStack(liquid, 1));     
} catch(e) {} 
}); 
  
block.outputLiquids = array;
block.liquidCapacity = 999999999;
  
} catch(e){
Vars.ui.showText("e", e);  
}});
