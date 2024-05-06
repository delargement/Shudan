import { createElement as h } from "preact";
import { useCallback } from "preact/hooks";
import classnames from "classnames";

import { avg, vertexEvents, signEquals } from "./helper.js";
import Marker from "./Marker.js";

const absoluteStyle = (zIndex) => ({
  position: "absolute",
  zIndex,
});

function piecetocode(piece) {
    const player = piece.player;
    const p = piece.piece;
    return player === -1 ? `1${p}` : `0${p}`
}
export default function Vertex(props) {
  let {
    position,
    shift,
    random,
    sign,
    piece,
    heat,
    paint,
    paintLeft,
    paintRight,
    paintTop,
    paintBottom,
    paintTopLeft,
    paintTopRight,
    paintBottomLeft,
    paintBottomRight,
    dimmed,
    marker,
    ghostStone,
    animate,
    selected,
    selectedLeft,
    selectedRight,
    selectedTop,
    selectedBottom,
  } = props;

  let eventHandlers = {};
  console.log(piece);
  console.log(piecetocode(piece));

  for (let eventName of vertexEvents) {
    eventHandlers[eventName] = useCallback(
      (evt) => {
        props[`on${eventName}`]?.(evt, position);
      },
      [...position, props[`on${eventName}`]]
    );
  }

  return h(
    "div",
    Object.assign(
      {
        "data-x": position[0],
        "data-y": position[1],

        title: marker?.label,
        style: {
          position: "relative",
        },
        className: classnames(
          "shudan-vertex",
          `shudan-random_${random}`,
          `shudan-sign_${sign}`,
          {
            [`shudan-shift_${shift}`]: !!shift,
            [`shudan-heat_${!!heat && heat.strength}`]: !!heat,
            "shudan-dimmed": dimmed,
            "shudan-animate": animate,

            [`shudan-paint_${paint > 0 ? 1 : -1}`]: !!paint,
            "shudan-paintedleft": !!paint && signEquals(paintLeft, paint),
            "shudan-paintedright": !!paint && signEquals(paintRight, paint),
            "shudan-paintedtop": !!paint && signEquals(paintTop, paint),
            "shudan-paintedbottom": !!paint && signEquals(paintBottom, paint),

            "shudan-selected": selected,
            "shudan-selectedleft": selectedLeft,
            "shudan-selectedright": selectedRight,
            "shudan-selectedtop": selectedTop,
            "shudan-selectedbottom": selectedBottom,

            [`shudan-marker_${marker?.type}`]: !!marker?.type,
            "shudan-smalllabel":
              marker?.type === "label" &&
              (marker.label?.includes("\n") || marker.label.length >= 3),

            [`shudan-ghost_${ghostStone?.sign}`]: !!ghostStone,
            [`shudan-ghost_${ghostStone?.type}`]: !!ghostStone?.type,
            "shudan-ghost_faint": !!ghostStone?.faint,
          }
        ),
      },
      ...vertexEvents.map((eventName) => ({
        [`on${eventName}`]: eventHandlers[eventName],
      }))
    ),
    h(
      "div",
      { key: "stone", className: "shudan-stone", style: absoluteStyle(2), },
        h(
          "div",
          {
            key: "inner",
            className: classnames(
              "shudan-inner",
              "shudan-stone-image",
              `shudan-random_${random}`,
              `shudan-sign_${sign}`
            ),
            style: {
              "background-image": `url(../css/Ryoko_pieces/${piecetocode(piece)}.svg)`,
            },
          },
        ),
    ),

    (!!paint || !!paintLeft || !!paintRight || !!paintTop || !!paintBottom) &&
      h("div", {
        key: "paint",
        className: "shudan-paint",
        style: {
          ...absoluteStyle(3),
          "--shudan-paint-opacity": avg(
            (!!paint
              ? [paint]
              : [paintLeft, paintRight, paintTop, paintBottom].map(
                  (x) => x !== 0 && !isNaN(x)
                )
            ).map((x) => Math.abs(x ?? 0) * 0.5)
          ),
          "--shudan-paint-box-shadow": [
            signEquals(paintLeft, paintTop, paintTopLeft)
              ? [Math.sign(paintTop), "-.5em -.5em"]
              : null,
            signEquals(paintRight, paintTop, paintTopRight)
              ? [Math.sign(paintTop), ".5em -.5em"]
              : null,
            signEquals(paintLeft, paintBottom, paintBottomLeft)
              ? [Math.sign(paintBottom), "-.5em .5em"]
              : null,
            signEquals(paintRight, paintBottom, paintBottomRight)
              ? [Math.sign(paintBottom), ".5em .5em"]
              : null,
          ]
            .filter((x) => !!x && x[0] !== 0)
            .map(
              ([sign, translation]) =>
                `${translation} 0 0 var(${
                  sign > 0
                    ? "--shudan-black-background-color"
                    : "--shudan-white-background-color"
                })`
            )
            .join(","),
        },
      }),
  );
}
