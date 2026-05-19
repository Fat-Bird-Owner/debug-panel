
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

Events.on(WorldLoadEvent, () => {
try {

const current = Vars.state.getSector();
const planet = current.planet;

if (!current || !planet) return;
  
planet.sectors.each(sector => {
try{

if(sector != current){
sector.info.destination = current;
}

}catch(e){}
});

Vars.ui.showInfoToast("Redirected all sectors on " + planet.localizedName, 5);
  
} catch(e){
Vars.ui.showInfoToast(e,5);
}});
