import Aurelia from "aurelia";

import { MyApp } from "./my-app";
import * as componentRegistry from "./componentRegistry";

Aurelia.register(componentRegistry).app(MyApp).start();
