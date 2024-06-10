import ColorThief from 'colorthief'

//API call to find background color using Color Thief
export async function fetchDominantColor({ url }: { url: string }): Promise<number[]> {
    const colorThief = new ColorThief();
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    let color: number[] = [127, 127, 127]; //default color
    img.onload = function () {
        try {
            const value = colorThief.getColor(img);
            color = [Math.min(value[0]+75, 255), Math.min(value[1]+75, 255), Math.min(value[2]+75, 255)];
        } catch (error) {
            console.log("Error in fetching color: ", error);
        }  
    }
    return color;
}