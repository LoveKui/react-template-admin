/**
 * 手机号验证
 */
export const IsCellphone = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;

/**
 * 邮箱验证
 */
export const IsEmail =
  /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;



/**
 * 身份证18位验证
 */
export const _IDRe18 = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}([0-9]|X)$/
/**
 * 身份证15位验证
 */


  /**
 * 监测只能输入数字下划线或者字母中文 不能输入特殊字符
 */
  export const ruleRegExp = {
    pattern: new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, 'g'),
    message: '请输入由中英文字符或数字组成的名称',
  };



/**
 * 检查是否有特殊字符
 * @date 2022-04-12
 * @param {any} str:string
 * @returns {any}
 */

export const chechTitle = (str: string) => {
  const pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]|[\\\\/]",
  );
  if (pattern.test(str)) {
    return true;
  }
  return false;
};