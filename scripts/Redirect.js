Events.on(WorldLoadEvent, () => {
try {

let exports = 0;
  
const current = Vars.state.getSector();
if (!current || !current.planet) return;
  
const planet = current.planet;
  
planet.sectors.each(sector => {
try{

if(sector != current){
sector.info.destination = current;

if (sector.info.export.size != 0) exports++;
}

}catch(e){}
});

if (exports != 0) Vars.ui.showInfoToast("[lightgrey]Redirected all launch pads on [accent]" + planet.localizedName, 5);
  
} catch(e){
Vars.ui.showInfoToast(e,5);
}});
