const avm = require('./avm');

(async () => {

  let data = new String("");
  try {
    await avm.initialize();
    data = await avm.iterateNotifications();
  } catch (e) {
    data = e;
  } finally {
    try {
      await avm.close();
    } catch (e) {}
  }

  console.log(data);

})();
