// src/domain/lens/explain/warnings.ts

import type { Answers } from "@/src/state/types";
import type { LensKey } from "../lensTypes";
import type { DerivedFlags } from "../scoring/deriveFlags";

export type WarningsParams = {
  finalKey: LensKey;
  answers: Answers;
  flags: DerivedFlags;
};

export type Warnings = {
  visionWarning: string;
  glassesWarning: string;
  retinaWarning: string;
};

export function generateWarnings(params: WarningsParams): Warnings {
  const { finalKey, answers, flags } = params;

  const isMono =
    finalKey === "farMono" || finalKey === "midMono" || finalKey === "nearMono";
  const isEDOF = finalKey === "EDOF";
  const isMF = finalKey === "MF";
  const isFarMono = finalKey === "farMono";
  const isMidMono = finalKey === "midMono";
  const isNearMono = finalKey === "nearMono";

  // Q11: 視力履歴（v3連番）
  let visionWarning = "";
  const visionHistory = answers.q11;

  if (visionHistory === 1 && isFarMono) {
    visionWarning =
      "これまで近くが裸眼でよく見える近視ぎみの状態でしたが、今回「遠方にピントを合わせる単焦点レンズ」を選択されたため、術後は近く（読書・スマホなど）を裸眼で見ることは難しくなります。近方作業にはメガネが必要になる可能性が高いことをご理解ください。";
  } else if (visionHistory === 1 && isMidMono) {
    visionWarning =
      "これまで近くが裸眼でよく見える近視ぎみの状態でしたが、今回「中間にピントを合わせる単焦点レンズ」を選択されたため、術後は近く（読書・スマホなど）を裸眼で見ることが難しくなる可能性があります。近方作業にはメガネが必要になることをご理解ください。";
  } else if (visionHistory === 2 && isNearMono) {
    visionWarning =
      "これまで遠くが裸眼で比較的見えていた遠視・老視ぎみの状態でしたが、今回「近方にピントを合わせる単焦点レンズ」を選択されたため、術後は遠くを見るときにメガネが必要になる可能性があります。";
  } else if (visionHistory === 2 && isMidMono) {
    visionWarning =
      "これまで遠くが裸眼で比較的見えていた遠視・老視ぎみの状態でしたが、今回「中間にピントを合わせる単焦点レンズ」を選択されたため、術後は遠くを見るときにメガネが必要になる可能性があります。";
  }

  let glassesWarning = "";
  if (flags.veryHateGlasses) {
    if (isMono) {
      glassesWarning =
        "問診票の Q6 で「メガネはできれば使いたくない」と強く回答されていますが、単焦点レンズではピントを合わせていない距離ではメガネが必要になります。特に選んだ距離以外（例：遠方に合わせた場合の近方作業など）では、メガネが必要となる可能性が高いことをご理解ください。";
    } else if (isEDOF || isMF) {
      glassesWarning =
        "問診票の Q6 で「メガネはできれば使いたくない」と強く回答されていますが、EDOF レンズや多焦点レンズでも、細かい作業や暗い場所などではメガネが必要になる場合があります。「完全にメガネが不要になる」ことを保証するものではないことをご理解ください。";
    }
  }

  let retinaWarning = "";
  if (flags.hasRetinaDisease) {
    retinaWarning =
      "問診票の Q10 から、網膜・黄斑・緑内障などの眼の病気の既往があることが分かりました。白内障手術では濁った水晶体を取り除くことでかすみやまぶしさの改善が期待できますが、網膜や視神経そのものの病気が治るわけではありません。そのため、手術をしても、これらの病気の影響で、見え方が思ったほど良くならないことがあります。";
  }

  return {
    visionWarning,
    glassesWarning,
    retinaWarning,
  };
}
