import { useColorScheme, useTheme } from "@mui/joy";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";
import { useCallback, useEffect, useState } from "react";

export function ThemeColorMeta() {
	const { mode, systemMode, setMode } = useColorScheme();
	const [ themeColor, setThemeColor ] = useState(getComputedStyle((document.querySelector(':root') as HTMLElement)).getPropertyValue('--joy-palette-background-surface'));
	useEffect(() => {
		setTimeout(() => setThemeColor(getComputedStyle((document.querySelector(':root') as HTMLElement)).getPropertyValue('--joy-palette-background-surface')), 1);
	}, [mode]);
	return <meta name="theme-color" content={themeColor}></meta>
}