
Events.on(ContentInitEvent, () => {
try{ 

Vars.state.rules. ambientLight = Color.valueOf("1d214ec3");
Planets.serpulo.atmosphereColor = Color.valueOf("1d214ec3");
  
} catch(e){
Vars.ui.showInfoToast(e,5);   
}});
