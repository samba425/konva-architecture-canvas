#!/usr/bin/env python3
"""
Convert old Konva native format JSON files to new custom format
"""
import json
import os
from datetime import datetime

def convert_old_to_new_format(old_data):
    """Convert old Konva format to new custom format"""
    
    # Initialize new format structure
    new_data = {
        "version": "1.0",
        "created": datetime.utcnow().isoformat() + "Z",
        "canvas": {
            "width": 1600,
            "height": 900,
            "scale": 1,
            "position": {
                "x": 0,
                "y": 0
            }
        },
        "shapes": []
    }
    
    # Check if it's old format
    if old_data.get("className") != "Layer" or "children" not in old_data:
        print("Not old format, returning as is")
        return old_data
    
    shape_id_counter = 1
    
    # Process each child in the old layer
    for child in old_data["children"]:
        attrs = child.get("attrs", {})
        className = child.get("className", "")
        
        shape = {
            "id": f"shape-{shape_id_counter}",
            "type": className,
            "x": attrs.get("x", 0),
            "y": attrs.get("y", 0),
            "rotation": attrs.get("rotation", 0)
        }
        shape_id_counter += 1
        
        # Handle different shape types
        if className == "Text":
            shape.update({
                "text": attrs.get("text", ""),
                "fontSize": attrs.get("fontSize", 16),
                "fontFamily": attrs.get("fontFamily", "Arial"),
                "fill": attrs.get("fill", "#000000"),
                "width": attrs.get("width", 200)
            })
            if attrs.get("fontStyle"):
                shape["fontStyle"] = attrs["fontStyle"]
            if attrs.get("align"):
                shape["align"] = attrs["align"]
                
        elif className == "Rect":
            shape.update({
                "width": attrs.get("width", 100),
                "height": attrs.get("height", 100),
                "fill": attrs.get("fill", "transparent"),
                "stroke": attrs.get("stroke", "#000000"),
                "strokeWidth": attrs.get("strokeWidth", 1)
            })
            if attrs.get("cornerRadius"):
                shape["cornerRadius"] = attrs["cornerRadius"]
                
        elif className == "Circle":
            shape.update({
                "radius": attrs.get("radius", 50),
                "fill": attrs.get("fill", "transparent"),
                "stroke": attrs.get("stroke", "#000000"),
                "strokeWidth": attrs.get("strokeWidth", 1)
            })
            
        elif className == "Arrow":
            shape.update({
                "points": attrs.get("points", []),
                "stroke": attrs.get("stroke", "#000000"),
                "strokeWidth": attrs.get("strokeWidth", 2),
                "fill": attrs.get("fill", "#000000"),
                "pointerLength": attrs.get("pointerLength", 10),
                "pointerWidth": attrs.get("pointerWidth", 10)
            })
            if attrs.get("dash"):
                shape["dash"] = attrs["dash"]
                
        elif className == "Line":
            shape.update({
                "points": attrs.get("points", []),
                "stroke": attrs.get("stroke", "#000000"),
                "strokeWidth": attrs.get("strokeWidth", 2)
            })
            if attrs.get("dash"):
                shape["dash"] = attrs["dash"]
                
        elif className == "Group":
            # Component group
            if attrs.get("name") == "component-group":
                shape.update({
                    "componentName": attrs.get("componentName", "Component"),
                    "componentIcon": attrs.get("componentIcon", "📦"),
                    "groupType": "component-group"
                })
                if attrs.get("faIcon"):
                    shape["faIcon"] = attrs["faIcon"]
                if attrs.get("iconColor"):
                    shape["iconColor"] = attrs["iconColor"]
                if attrs.get("color"):
                    shape["color"] = attrs["color"]
                if attrs.get("scaleX"):
                    shape["scaleX"] = attrs["scaleX"]
                if attrs.get("scaleY"):
                    shape["scaleY"] = attrs["scaleY"]
            else:
                # Generic group
                shape["groupType"] = "generic-group"
                if attrs.get("scaleX"):
                    shape["scaleX"] = attrs["scaleX"]
                if attrs.get("scaleY"):
                    shape["scaleY"] = attrs["scaleY"]
        
        new_data["shapes"].append(shape)
    
    return new_data


def convert_file(input_path, output_path):
    """Convert a single file"""
    print(f"Converting {input_path}...")
    
    with open(input_path, 'r') as f:
        old_data = json.load(f)
    
    new_data = convert_old_to_new_format(old_data)
    
    with open(output_path, 'w') as f:
        json.dump(new_data, f, indent=2)
    
    print(f"  ✓ Saved to {output_path}")


def main():
    samples_dir = "samples"
    
    # List of old format files to convert
    old_format_files = [
        "01-simple-rag-chatbot.json",
        "02-multi-model-ai-platform.json",
        "03-cloud-infrastructure.json",
        "04-enterprise-ai-platform.json",
        "05-observability-stack.json"
    ]
    
    print("=" * 60)
    print("Converting old format sample files to new format")
    print("=" * 60)
    print()
    
    for filename in old_format_files:
        input_path = os.path.join(samples_dir, filename)
        output_path = input_path  # Overwrite the same file
        
        if os.path.exists(input_path):
            convert_file(input_path, output_path)
        else:
            print(f"⚠️  File not found: {input_path}")
    
    print()
    print("=" * 60)
    print("✓ Conversion complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
