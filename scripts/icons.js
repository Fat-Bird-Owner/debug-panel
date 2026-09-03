function loadIcons(){
    Log.info("=== ICON LOADER START ===");

    let props = new java.util.Properties();

    try{
        let reader = Vars.tree
            .get("icons/dbp-icons.properties")
            .reader(512);

        try{
            props.load(reader);
        }finally{
            reader.close();
        }

        Log.info("Properties loaded: " + props.size());
    }catch(e){
        Log.err("FAILED TO LOAD ICON PROPERTIES");
        Log.err(e);
        return;
    }

    let entry = props.get("59558");

    Log.info("Entry 59558: " + entry);

    try{
        let parts = String(entry).split("\\|");

        let contentName = parts[0];
        let textureName = parts[1];

        Log.info("Name: " + contentName);
        Log.info("Texture: " + textureName);

        let region = Core.atlas.find(textureName);

        Log.info("Region: " + region);
        Log.info("Region texture: " + region.texture);
        Log.info("Region size: " + region.width + "x" + region.height);

        Fonts.registerIcon(
            contentName,
            textureName,
            59558,
            region
        );

        Log.info("=== REGISTERED ===");

    }catch(e){
        Log.err("FAILED TO REGISTER ICON");
        Log.err(e);
    }
}


function constructGlyph(id, region, size, fontSize){
    let glyph = new Font.Glyph();

    try{
        glyph.id = id;
        glyph.srcX = 0;
        glyph.srcY = 0;

        glyph.width = (size.x | 0);
        glyph.height = (size.y | 0);

        glyph.u = region.u;
        glyph.v = region.v2;
        glyph.u2 = region.u2;
        glyph.v2 = region.v;

        glyph.xoffset = 0;
        glyph.yoffset = -fontSize;
        glyph.xadvance = fontSize;

        glyph.fixedWidth = true;
        glyph.page = 0;
    }catch(e){
        return null;
    }

    return glyph;
}

Events.on(ClientLoadEvent, () => {
loadIcons();
});
