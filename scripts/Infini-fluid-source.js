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
  
} catch(e){
Vars.ui.showText("e", e);  
}});
