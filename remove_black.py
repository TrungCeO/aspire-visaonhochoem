from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.get_flattened_data()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        
        # Strict pure black removal to avoid eating into the planet's shadow
        if r <= 3 and g <= 3 and b <= 3:
            newData.append((0, 0, 0, 0))
        elif r <= 10 and g <= 10 and b <= 10:
            # Soft transition for very dark gray edges
            alpha = int(((r+g+b)/3) / 10 * 255)
            newData.append((r, g, b, alpha))
        else:
            newData.append(item)
                
    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Background removed strictly")

if __name__ == "__main__":
    remove_black_background("assets/neptune_raw.png", "assets/neptune.png")
