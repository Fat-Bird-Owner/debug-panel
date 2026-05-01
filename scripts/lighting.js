
Events.on(ContentInitEvent, () => {
try{ 
  
Planets.serpulo.atmosphereColor = Color.valueOf("1d214ec3");
  
} catch(e){
Vars.ui.showInfoToast(e,5);   
}});

Events.on(WorldLoadEvent, () => {
try {
if (Vars.state.rules.planet != Planets.serpulo) return;
Vars.state.rules.ambientLight = Color.valueOf("1d214ec3");

} catch(e){
Vars.ui.showInfoToast(e,5);
}});
