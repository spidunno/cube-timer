import { useState, useEffect } from "react";
import { useScramble } from "./utils/useScramble";
import { useTimer } from "./utils/useTimer";
import { CssVarsProvider } from "@mui/joy/styles";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Drawer from "@mui/joy/Drawer";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import ThemeToggle from "./components/ThemeToggle";
import ChipDelete from '@mui/joy/ChipDelete';
import Chip from '@mui/joy/Chip';
import "./App.css";
import { formatTime } from "./utils/formatTime";
import DialogContent from '@mui/joy/DialogContent';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import { stringify } from "querystring";

type historyItem = {time: number; scramble: string; date: number; plus2?: boolean; dnf?: boolean};

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scramble, refreshScramble, setScramble] = useScramble({});
  const [time, running, start, stop, reset] = useTimer();
  const [ready, setReady] = useState(false);
  const [normal, setNormal] = useState(true);
  if (
    typeof localStorage.getItem("history") !== "string" ||
    !(JSON.parse(localStorage.getItem("history") as string) instanceof Array)
  ) {
    localStorage.setItem("history", JSON.stringify([]));
  }
  const [solveHistory, setSolveHistory] = useState(
    JSON.parse(localStorage.getItem("history") as string) as Array<historyItem>
  );
	useEffect(() => {
		if (!running && time !== 0) {
			setSolveHistory((s: Array<historyItem>) => 
				[{ time, scramble, date: Date.now() }, ...solveHistory]
			);
			setReady(false);
			refreshScramble();
		}
	}, [running]);
	useEffect(() => {
		localStorage.setItem("history", JSON.stringify(solveHistory));
	}, [solveHistory]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (event: KeyboardEvent | TouchEvent) => {
      if (event instanceof TouchEvent || (event.code === "Space" && !event.repeat)) {
        if (event instanceof KeyboardEvent) event.preventDefault();
        if (!running) {
          setNormal(false);
          timeout = setTimeout(() => {
            reset();
            setReady(true);
          }, 250);
        } else {
          stop();
          // setSolveHistory(
          //   [{ time, scramble, date: Date.now() }, ...solveHistory]
          // );
          // setReady(false);
          // refreshScramble();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent | TouchEvent) => {
      if (event instanceof TouchEvent || (event.code === "Space" && !event.repeat)) {
        if (event instanceof KeyboardEvent) event.preventDefault();
        setNormal(true);
        if (ready) {
          start();
          setReady(false);
        } else {
          clearTimeout(timeout);
          setReady(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
		document.getElementById('touchlistener')?.addEventListener("touchstart", handleKeyDown);
    document.getElementById('touchlistener')?.addEventListener("touchend", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
			document.getElementById('touchlistener')?.removeEventListener("touchstart", handleKeyDown);
			document.getElementById('touchlistener')?.removeEventListener("touchend", handleKeyUp);
      clearTimeout(timeout);
    };
  }, [running, start, stop, reset, ready]);
	let bestSolve = [...solveHistory].sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0)[0];
	console.log(bestSolve);
  return (
    <CssVarsProvider>
			<title>{(solveHistory[0] ? formatTime((solveHistory[0].time)) + ' - ' : '') + 'Cube Timer'}</title>
      <Sheet
        className="app"
        color="primary"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <div style={{
          // p: 3,
          width: '100%',
					margin: 0,
					padding: 0,
					height: '100%',
					transition: 'opacity 250ms',opacity: running || ready ? 0 : 100
        }}><Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ textAlign: "center",  }}
        >
          <Typography level="title-lg" sx={{ margin: 1 }}>
            Previous Solves
          </Typography>
          <Divider></Divider>
					<DialogContent>
					<List>
          {solveHistory.map(
            (v: { time: number; date: number; scramble: string; dnf?: boolean, plus2?: boolean }, i: number) => {
              let date = new Date(v.date);
              return (
                <Dropdown key={i}>
                  <MenuButton
                    sx={{
                      margin: 1,
                      textAlign: "start",
                      display: "block",
                      padding: 2,
											// height: '1000px !important'
                    }}
                  >
                    <Typography level="body-sm">
                      {" "}
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ][date.getMonth()] +
                        " " +
                        date.getDate() +
                        ", " +
                        date.getFullYear() +
                        " at " +
                        date.toLocaleTimeString()}{" "}
                    </Typography>
                    <Typography level="title-md">
                      {formatTime(v.time)}
											{solveHistory[i].plus2 ? <Chip sx={{marginLeft: 1, marginTop: -0.5}} variant="soft" size="md" color="warning" endDecorator={<ChipDelete onDelete={(e) => {e.stopPropagation(); let newSolveHistory = [...solveHistory]; newSolveHistory[i].plus2 = false; setSolveHistory(newSolveHistory);}}></ChipDelete>}>+2</Chip> : ''}
											{solveHistory[i].dnf ? <Chip sx={{marginLeft: 1, marginTop: -0.5}} variant="soft" size="md" color="danger" endDecorator={<ChipDelete onDelete={(e) => {e.stopPropagation(); let newSolveHistory = [...solveHistory]; newSolveHistory[i].dnf = false; setSolveHistory(newSolveHistory);}}></ChipDelete>}>DNF</Chip> : ''}
											{v.plus2 ? <Typography color="neutral"> = {formatTime(v.time + 2000)}</Typography> : ''}
                    </Typography>
                    <Typography level="body-sm">{v.scramble}</Typography>
                  </MenuButton>
                  <Menu sx={{zIndex: 1300, position: 'absolute', paddingTop: 0, paddingBottom: 0}} placement={'right'}>
									<MenuItem sx={{paddingTop: 0.84}} onClick={() => {let newSolveHistory = [...solveHistory]; newSolveHistory[i].plus2 = true; setSolveHistory(newSolveHistory);}}>+2</MenuItem>
									<MenuItem sx={{paddingTop: 0.84}} onClick={() => {let newSolveHistory = [...solveHistory]; newSolveHistory[i].dnf = true; setSolveHistory(newSolveHistory);}}>DNF</MenuItem>
										<MenuItem sx={{paddingTop: 0.84}} color="primary" onClick={() => {setScramble(v.scramble); setDrawerOpen(false)}}>Retry Scramble</MenuItem>
										<MenuItem color="danger" variant='soft' sx={{paddingBottom: 0.8}} onClick={() => {let newSolveHistory = [...solveHistory]; newSolveHistory.splice(i, 1); setSolveHistory(newSolveHistory);}}>Delete</MenuItem>
									</Menu>
                </Dropdown>
              );
            }
          )}
					</List>
					</DialogContent>
        </Drawer>
        <div
          style={{
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
						alignItems: 'center',
						alignContent: 'center',
          }}
        >
          <IconButton
            /*sx={{ alignSelf: 'start', marginLeft: 0, marginRight: 'auto' }}*/
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
					<Button sx={{marginLeft: '60px'}} variant="outlined" onClick={refreshScramble}>Scramble</Button>
          <ThemeToggle></ThemeToggle>
        </div>
				</div>
        <Divider sx={{transition: 'opacity 250ms',opacity: running || ready ? 0 : 100}}></Divider>
        <span style={{transition: 'opacity 250ms',opacity: running || ready ? 0 : 100}}>{scramble}</span>
        <Typography
          fontSize={148}
          level="h1"
          color={normal ? undefined : ready ? "success" : "danger"}
					style={{transition: 'top 200ms', top: running || ready ? 'calc(50vh - 97.5px)' : '133px', position: 'absolute'}}
        >
          <code>{formatTime(time)}</code>
        </Typography>
				{time !== 0 && solveHistory.length >= 2 ? ((solveHistory[0].time - bestSolve?.time) !== 0 ? 
					<Typography
						fontSize={'3vw'}
						level="h1"
						color={Math.sign(solveHistory[0].time - (bestSolve?.time || solveHistory[0].time)) === -1 ? 'success' : 'danger'}
						style={{transition: 'opacity 250ms',opacity: running || ready ? 0 : 100, position: 'relative', top: 'calc(133px + 1em)'}}
					>
						{(Math.sign(solveHistory[0].time - (bestSolve?.time || solveHistory[0].time)) === -1 ? '-' : Math.sign(solveHistory[0].time - (bestSolve?.time || solveHistory[0].time)) === 1 ? '+' : '') + formatTime(Math.abs(solveHistory[0].time - (bestSolve?.time || solveHistory[0].time)))}
					</Typography> : <Typography
						fontSize={'3vw'}
						level="h1"
						color={Math.sign(solveHistory[0].time - (solveHistory[1]?.time || solveHistory[0].time)) === -1 ? 'success' : 'danger'}
						style={{transition: 'opacity 250ms',opacity: running || ready ? 0 : 100, position: 'relative', top: 'calc(133px + 1em)'}}
					>
						{(Math.sign(solveHistory[0].time - (solveHistory[1]?.time || solveHistory[0].time)) === -1 ? '-' : Math.sign(solveHistory[0].time - (solveHistory[1]?.time || solveHistory[0].time)) === 1 ? '+' : '') + formatTime(Math.abs(solveHistory[0].time - (solveHistory[1]?.time || solveHistory[0].time)))}
					</Typography> ) : ''}
      </Sheet>
    </CssVarsProvider>
  );
}

export default App;
