/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = '/da';
  window.SITE_CONFIG['menuTitle'] = '全息档案';
  window.SITE_CONFIG['platformTitle'] = '全息档案';
  window.SITE_CONFIG['minTitle'] = '支撑';
  // cdn地址 = 域名 + 版本号
  // window.SITE_CONFIG['domain']  = './'; // 域名
  // window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  // window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;

   // 请求超时时间设置 （秒为单位）
   window.SITE_CONFIG['timeout'] = 60 
  
})();
