import { createElement } from "react";
import { makeRenderer } from "@/lib/wirepad-lib";
import { Icon } from "./icon";

/** Draws one wireframe element filling its positioned box. */
export const renderElement = makeRenderer(createElement, Icon);
