import { render } from "solid-js/web";

import { UseForm } from "./UseForm";
import { UseFormRecieveSignal } from "./UseFormRecieveSignal";
import { UseFormSignals } from "./UseFormSignals";
import { UseFormSignalsRecieveSignal } from "./UseFormSignalsRecieveSignal";

render(() => {
  return (
    <>
      <UseForm />
      <br />
      <br />
      <br />
      <UseFormRecieveSignal />
      <br />
      <br />
      <br />
      <UseFormSignals />
      <br />
      <br />
      <br />
      <UseFormSignalsRecieveSignal />
    </>
  );
}, document.getElementById("app"));
