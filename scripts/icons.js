function loadIcons(){
    let availableFonts = Seq.with(Fonts.def, Fonts.outline);
    let fontSize = Fonts.def.getData().lineHeight /
                   Fonts.def.getData().scaleY;

    let iconProperties = new java.util.Properties();

    // Load icon mappings
    try{
        let reader = Vars.tree
            .get("icons/vanilla-icons.properties")
            .reader(512);

        try{
            iconProperties.load(reader);
        }finally{
            try{
                reader.close();
            }catch(e){}
        }
    }catch(e){
        return;
    }

    // Iterate through properties
    try{
        let entries = iconProperties.entrySet().iterator();

        while(entries.hasNext()){
            let entry = entries.next();

            try{
                let codePointStr = String(entry.getKey());
                let valueParts = String(entry.getValue()).split("\\|");

                if(valueParts.length < 2){
                    continue;
                }

                let codePoint = parseInt(codePointStr);
                if(isNaN(codePoint)){
                    continue;
                }

                let textureName = valueParts[1];

                let region;

                try{
                    region = Core.atlas.find(textureName);
                }catch(e){
                    continue;
                }

                if(region == null){
                    continue;
                }

                let scaledSize;

                try{
                    scaledSize = Scaling.fit.apply(
                        region.width,
                        region.height,
                        fontSize,
                        fontSize
                    );
                }catch(e){
                    continue;
                }

                let glyph;

                try{
                    glyph = constructGlyph(
                        codePoint,
                        region,
                        scaledSize,
                        fontSize
                    );
                }catch(e){
                    continue;
                }

                // Register glyph in both fonts
                for(let i = 0; i < availableFonts.size; i++){
                    try{
                        availableFonts.get(i)
                            .getData()
                            .setGlyph(codePoint, glyph);
                    }catch(e){}
                }

            }catch(e){
                // Ignore invalid icon entries
            }
        }

    }catch(e){
        // Failed to iterate properties
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
