Events.on(WorldLoadEvent, () => {
try {

const current = Vars.state.getSector();
if (!current || !current.planet) return;
  
const planet = current.planet;
  
planet.sectors.each(sector => {
try{

if(sector != current){
sector.info.destination = current;
}

}catch(e){}
});

Vars.ui.showInfoToast("[lightgrey]Redirected all launch pads on [accent]" + planet.localizedName, 5);
  
} catch(e){
Vars.ui.showInfoToast(e,5);
}});
