function loadIcons(){
    let iconProperties = new java.util.Properties();

    try{
        let reader = Vars.tree
            .get("icons/vanilla-icons.properties")
            .reader(512);

        try{
            iconProperties.load(reader);
        }finally{
            reader.close();
        }
    }catch(e){
        return;
    }

    let entries = iconProperties.entrySet().iterator();

    while(entries.hasNext()){
        let entry = entries.next();

        try{
            let codePoint = parseInt(String(entry.getKey()));
            let valueParts = String(entry.getValue()).split("\\|");

            if(valueParts.length < 2) continue;

            let contentName = valueParts[0];
            let textureName = valueParts[1];

            let region = Core.atlas.find(textureName);

            Fonts.registerIcon(
                contentName,
                textureName,
                codePoint,
                region
            );

            let iconFont = Fonts.icon;

            let size = Fonts.icon.getData().lineHeight /
                       Fonts.icon.getData().scaleY;

            let out = Scaling.fit.apply(
                region.width,
                region.height,
                size,
                size
            );

            let glyph = new Font.Glyph();

            glyph.id = codePoint;
            glyph.srcX = 0;
            glyph.srcY = 0;
            glyph.width = out.x | 0;
            glyph.height = out.y | 0;

            glyph.u = region.u;
            glyph.v = region.v2;
            glyph.u2 = region.u2;
            glyph.v2 = region.v;

            glyph.xoffset = 0;
            glyph.yoffset = -size;
            glyph.xadvance = size;

            glyph.kerning = null;
            glyph.fixedWidth = true;
            glyph.page = 0;

            iconFont.getData().setGlyph(codePoint, glyph);

        }catch(e){
            Log.err(e);
        }
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
