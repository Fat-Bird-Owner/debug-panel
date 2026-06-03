Events.on(ContentInitEvent, () => {
try{
const block = Vars.content.block("dbp-infini-source");
let array = [];  
Vars.content.items().each(item => {
try {          
array.push(new ItemStack(item, 1));     
} catch(e) {} 
}); 
  
block.outputItems = array;
block.itemCapacity = infinite;
  
} catch(e){
Vars.ui.showText("e", e);  
}});
