import styles from './App.module.css';
import {CircleProgressContainer} from "./assets/Components/CircleProgress";
import {BottomInfoData} from "./assets/Components/BottomInfoData";
import {InfoHud} from "./assets/Components/InfoHud";
import {Speedo} from "./assets/Components/Speedo";
import {createEffect, createSignal,Show} from "solid-js";
import {
    disableDefaultConfig,
    defaultConfig
} from "../DefaultDatas";
import {SettingsPanel} from "./assets/Components/SettingsPanel/SettingsPanel";
import {useHudStorageDispatch, useHudStorageState} from "./assets/Contexts/HudStorage";
import {useSettingsStorageDispatch, useSettingsStorageState} from "./assets/Contexts/SettingsStorage";
import {createStore} from "solid-js/store";


function App() {

    const hudStorageState = useHudStorageState();
    const { updateStatus, updateSpeedo, updateHud , changeVoiceRange } = useHudStorageDispatch();

    const { toggleShowPanel , changeThemeColors , setDefaultConfigs , handleLocalStorage } = useSettingsStorageDispatch();
    const settingsStorageState = useSettingsStorageState();
    const settings = () => settingsStorageState.settings
    const showPanel = () => settingsStorageState.showPanel

    const open = () =>{
        document.body.style.display = "flex";
    }

    const close = () =>{
        document.body.style.display = "none";
    }

    createEffect(()=>{
        window.addEventListener("message", function (event) {
            const type = event.data.type;
            const value = event.data.value;
            switch (type) {
                case "SHOW":
                    value ? open() : close()
                    break;
                case "SET_CONFIG_DATA":
                    setDefaultConfigs(value)
                    const speedoColors = handleLocalStorage("speedoColors","get")
                    if(!speedoColors){
                        changeThemeColors(value["Colors"]["Speedo"])
                    }
                    break;
                case "VEH_HUD":
                    updateSpeedo(value)
                    break;
                case "STATUS_HUD":
                    updateStatus(value)
                    break;
                case "HUD_DATA":
                    updateHud(value)
                    break;
                case "VOICE_RANGE":
                    changeVoiceRange(value)
                    break;
                case "OPEN_SETTINGS":
                    toggleShowPanel()
                    break;
            }
        });
    })

  return (
    <div class={styles.App}>
        <SettingsPanel/>
        <Show keyed when={!settings().Status}>
            <CircleProgressContainer/>
        </Show>
        <BottomInfoData/>
        <InfoHud/>
        <Show keyed when={!settings().Vehicle}>
            <Speedo/>
        </Show>
    </div>
  );
}

export default App;
