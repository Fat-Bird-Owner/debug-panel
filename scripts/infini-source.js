Events.on(ContentInitEvent, () => {
try{
const block = Vars.content.block("dp-infini-source");
let array = [];  
Vars.content.items().each(item => {
try {          
array.push(new ItemStack(item, 1));     
} catch(e) {} 
}); 
  
block.outputItems = array;

} catch(e){
Vars.ui.showText("e", e);  
}});
