/**
 * Represents css filters that can be applied to pure white/black elements to make them a desired color
 */
export enum ColorFilter {
    Red = "brightness(0) saturate(100%) invert(17%) sepia(93%) saturate(6389%) hue-rotate(358deg) brightness(104%) contrast(119%)",
    Orange = "brightness(0) saturate(100%) invert(66%) sepia(86%) saturate(2871%) hue-rotate(0deg) brightness(102%) contrast(105%)",
    Yellow = "brightness(0) saturate(100%) invert(87%) sepia(82%) saturate(2327%) hue-rotate(359deg) brightness(107%) contrast(104%)",
    Green = "brightness(0) saturate(100%) invert(66%) sepia(72%) saturate(4610%) hue-rotate(85deg) brightness(115%) contrast(133%)",
    Blue = "brightness(0) saturate(100%) invert(8%) sepia(93%) saturate(7493%) hue-rotate(247deg) brightness(99%) contrast(143%)",
    Aqua = "brightness(0) saturate(100%) invert(84%) sepia(99%) saturate(1912%) hue-rotate(107deg) brightness(103%) contrast(104%;",
    Indigo = "brightness(0) saturate(100%) invert(28%) sepia(97%) saturate(7368%) hue-rotate(315deg) brightness(100%) contrast(109%;",
    Violet = "brightness(0) saturate(100%) invert(9%) sepia(100%) saturate(6767%) hue-rotate(277deg) brightness(112%) contrast(117%;",
    Magenta = "brightness(0) saturate(100%) invert(22%) sepia(88%) saturate(4704%) hue-rotate(292deg) brightness(109%) contrast(129%;"
}
export class Color {
    public static readonly Lookup: ColorMap = Color.GetMap();
    private static ToColorToken(value: string): ColorToken | undefined {
        return Object.values(ColorToken).find(key => key === value);
    }
    /**takes a possible string representation of a color and returns the filter style for that color.
     * this only works for a limited number of predefined colors
     */
    public static ToColorFilter(sColor: string): ColorFilter | undefined {
        const colorToken = Color.ToColorToken(sColor);
        if (!colorToken) {
            return;
        }
        return Color.Lookup[colorToken];
    }
    private static GetMap(): ColorMap {
        return {
            "Red": ColorFilter.Red,
            "Orange": ColorFilter.Orange,
            "Yellow": ColorFilter.Yellow,
            "Green": ColorFilter.Green,
            "Blue": ColorFilter.Blue,
            "Aqua": ColorFilter.Aqua,
            "Indigo": ColorFilter.Indigo,
            "Violet": ColorFilter.Violet,
            "Magenta": ColorFilter.Magenta
        };
    }
}

export enum ColorToken {
    Red = "Red",
    Orange = "Orange",
    Yellow = "Yellow",
    Green = "Green",
    Blue = "Blue",
    Aqua = "Aqua",
    Indigo = "Indigo",
    Violet = "Violet",
    Magenta = "Magenta"
}

type ColorMap = Readonly<{
    [ck in ColorToken]: ColorFilter;
}>;
