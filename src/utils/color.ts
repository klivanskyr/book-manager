import ColorThief from 'colorthief'

//API call to find background color using Color Thief
export function fetchDominantColor(url: string): Promise<number[]> {
    return new Promise((resolve, _) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => {
            try {
                const colorThief = new ColorThief();
                const [r, g, b] = colorThief.getColor(img);
                resolve([Math.min(r + 75, 255), Math.min(g + 75, 255), Math.min(b + 75, 255)]);
                
            } catch (error) {
                console.error("Error in fetching color: ", error);
                resolve([127, 127, 127]) //default color
            }
        };
    });
}