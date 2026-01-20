// src/domain/lens/explain/reasonText.ts

import type { Answers } from "@/src/state/types";
import type { LensKey, MonoLensKey } from "../lensTypes";
import type { DerivedFlags } from "../scoring/deriveFlags";

export type ReasonTextParams = {
  finalKey: LensKey;
  answers: Answers;
  flags: DerivedFlags;
  monoChoice?: MonoLensKey | null;
  overridePremium?: boolean;
};

const distanceLabelMap: Record<MonoLensKey, string> = {
  farMono: "遠方",
  midMono: "中間",
  nearMono: "近方",
};

export function generateReasonText(params: ReasonTextParams): string {
  const { finalKey, answers, flags, monoChoice, overridePremium } = params;

  const isMono =
    finalKey === "farMono" || finalKey === "midMono" || finalKey === "nearMono";
  const isEDOF = finalKey === "EDOF";
  const isMF = finalKey === "MF";

  const distanceLabelForMono = monoChoice ? distanceLabelMap[monoChoice] : "";

  const strongAllDistances =
    answers.q1 !== null && answers.q1 <= 2 &&
    answers.q2 !== null && answers.q2 <= 2 &&
    answers.q3 !== null && answers.q3 <= 2;

  const wantsInsurance = flags.costPriorityHigh;
  const haloNightRisk = flags.haloAbsoluteNo || flags.nightDrivingOften;

  let reasonText = "";

  if (flags.hasRetinaDisease && isMono && !overridePremium) {
    reasonText =
      "問診票の Q10 から、網膜・黄斑・緑内障などの眼の病気を指摘されたご経験があることが分かりました。こうした病気がある場合、多焦点レンズや EDOF レンズはコントラスト感度の低下や見え方の質の低下が強く出る可能性があるため、一般的には単焦点レンズを第一選択とします。単焦点レンズは、遠方・中間・近方のどれか１つにピントを合わせるレンズです。";

    if (strongAllDistances) {
      reasonText +=
        "今回のご回答では、遠方・中間・近方のすべてについて「裸眼で見たい」というご希望が強く出ていますが、単焦点レンズではこのすべてを同時に満たすことはできません。そのため、この中から最も大切な距離として「" +
        distanceLabelForMono +
        "」を選んでいただき、その距離を優先する単焦点レンズを最終希望としました。";
    } else if (distanceLabelForMono) {
      reasonText +=
        "そのうえで、最も大切な距離として「" +
        distanceLabelForMono +
        "」を選んでいただき、その距離を優先する単焦点レンズを最終希望としました。";
    }
  } else if (flags.hasRetinaDisease && (isEDOF || isMF) && overridePremium) {
    const premiumName = isEDOF ? "EDOF レンズ" : "多焦点レンズ";

    reasonText =
      "問診票の Q10 から、網膜・黄斑・緑内障などの眼の病気を指摘されたご経験があることが分かりました。本来このような場合、多焦点レンズや EDOF レンズはコントラスト感度や見え方の質が低下しやすいため、単焦点レンズが第一選択となります。";

    if (isMF && strongAllDistances) {
      reasonText +=
        "今回のご回答では、遠方・中間・近方すべてをできるだけ裸眼で見たいというご希望が強く、そのメリットを優先したいというご判断から、リスクをご理解いただいたうえで「" +
        premiumName +
        "」を希望されました。その意思を尊重し、このレンズを最終決定としています。";
    } else {
      reasonText +=
        "一方で、できるだけメガネを減らしたいというご希望と、そのためのリスクを理解し受け入れるというご判断から、「" +
        premiumName +
        "」を希望されました。その患者さまご自身の選択を尊重し、このレンズを最終決定としています。";
    }
  } else if (!flags.hasRetinaDisease && haloNightRisk && (isEDOF || isMF) && overridePremium) {
    const premiumName = isEDOF ? "EDOF レンズ" : "多焦点レンズ";

    reasonText =
      "問診票の Q5（ハロー・グレア）や Q9（夜間運転）のご回答から、夜間のライトのにじみやギラつき、あるいは夜間運転の頻度が高いことが分かりました。本来このような場合、夜間の見え方と安全性を優先して単焦点レンズを第一選択とします。";

    if (isMF && strongAllDistances) {
      reasonText +=
        "今回のご回答では、遠方・中間・近方すべてをできるだけ裸眼で見たいというご希望が強く、そのメリットを優先したいというご判断から、夜間の見え方のリスクをご理解いただいたうえで「" +
        premiumName +
        "」を希望されました。その意思を尊重し、このレンズを最終決定としています。";
    } else {
      reasonText +=
        "一方で、メガネをできるだけ減らしたいというご希望と、ハロー・グレアや夜間の見え方に関するリスクを理解し受け入れるというご判断から、「" +
        premiumName +
        "」を希望されました。その患者さまご自身の選択を尊重し、このレンズを最終決定としています。";
    }
  } else if (isMono) {
    if (wantsInsurance && distanceLabelForMono) {
      reasonText =
        "問診票で「保険適用内のレンズを希望する」と回答され、遠方・中間・近方のうち最も大切な距離として「" +
        distanceLabelForMono +
        "」を選ばれました。そのため、患者さまご自身の選択にもとづき、その距離を優先する単焦点レンズを最終希望としました。";
    } else if (distanceLabelForMono) {
      reasonText =
        "遠方・中間・近方のうち最も大切な距離として「" +
        distanceLabelForMono +
        "」を選ばれたため、その距離を優先する単焦点レンズを最終希望としました。この結果は患者さまご自身の生活スタイルと希望にもとづくものです。";
    } else {
      reasonText =
        "単焦点レンズを希望され、問診票で選ばれた優先距離にもとづいて焦点距離を決定しました。";
    }

    if (strongAllDistances) {
      reasonText +=
        "なお、今回の回答では遠方・中間・近方すべてを裸眼で見たいというご希望も強く出ていますが、単焦点レンズではこのすべてを同時に満たすことはできないことをご説明したうえで、最も優先したい距離を１つに絞っていただいています。";
    }
  } else if (isEDOF) {
    reasonText =
      "遠方から中間の距離をできるだけメガネに頼らず見たいというご希望があり、ハロー・グレアや見え方の質についても多焦点レンズほどの変化は避けたいという回答であったため、その中間的な選択肢として EDOF レンズを選択しました。患者さまご自身の生活スタイルと希望に最も近いバランスのレンズです。";
  } else if (isMF) {
    if (strongAllDistances) {
      reasonText =
        "遠方・中間・近方のすべてをできるだけ裸眼で見たいというご希望が強く、メガネを使う頻度を減らしたいこと、ハロー・グレアや費用についても一定のご納得が得られたことから、多焦点レンズを選択しました。これは、患者さまご自身の価値観と回答にもとづく主体的な選択です。";
    } else {
      reasonText =
        "複数の距離でメガネなしの見え方を重視したいというご希望と、ハロー・グレアや費用についても許容できるという回答にもとづき、多焦点レンズを選択しました。";
    }
  } else {
    reasonText =
      "問診票でのご回答（生活スタイル、メガネの許容度、費用や夜間運転の有無など）をもとに、このレンズが患者さまの希望に最も近いとシステムが判定した結果です。";
  }

  return reasonText;
}
