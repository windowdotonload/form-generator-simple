import { updateTrainTestInfo, getTrainDetail } from "../../api/index";
import { openLoading, closeLoading } from "@/api/request.js";

export async function polling(cache, cb) {
  closeLoading();

  try {
    const res = await updateTrainTestInfo({
      id: cache.id
    });
    if (res.data.code != 1000) return cb({ code: -1 });
    const detailRes = await getTrainDetail({
      trainId: cache.id
    });
    Vue.prototype.$gio.submitAnswerSheet();
    return cb({
      code: 1000,
      detailRes
    });
  } finally {
    openLoading();
  }
}
