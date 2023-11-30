import { useColorScheme } from "@mui/joy";
import { useEffect, useState, Component } from "react";
import Switch from '@mui/joy/Switch';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import { PropsOf } from "@emotion/react";

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
	const r = document.querySelector(':root') as HTMLElement;
  useEffect(() => {
    setMounted(true);
		r.style.setProperty('--color-scheme', mode as string);
  }, []);
	useEffect(() => {
		r.style.setProperty('--color-scheme', mode as string);
	}, [mode]);
  if (!mounted) {
    return null;
  }
  return (
    <Switch
			sx={{
				// alignSelf: 'end',
				// marginBottom: 1,
				// marginRight: 0,
				// marginLeft: 'auto'
			}}
			startDecorator={<LightMode></LightMode>}
			endDecorator={<DarkMode></DarkMode>}
      variant="solid"
			checked={mode === 'dark'}
      onChange={(e) => {
        setMode(e.target.checked ? 'dark' : 'light');
      }}
    >
    </Switch>
  );
}