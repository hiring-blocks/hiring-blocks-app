exports.templateCertificate = (certificateDetails) => {
  let time = new Date(certificateDetails.updatedAt).getTime() + 330 * 60000;
  const template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>Forgot password</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">#outlook a {  padding:0;}.ExternalClass { width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {  line-height:100%;}.es-button {  mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors] { color:inherit!important;  text-decoration:none!important; font-size:inherit!important;  font-family:inherit!important;  font-weight:inherit!important;  line-height:inherit!important;}.es-desk-hidden {  display:none; float:left; overflow:hidden;  width:0;  max-height:0; line-height:0;  mso-hide:all;}.es-button-border:hover a.es-button, .es-button-border:hover button.es-button { background:#ffffff!important; border-color:#ffffff!important;}.es-button-border:hover { background:#ffffff!important; border-style:solid solid solid solid!important; border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1 { font-size:20px!important; text-align:center; line-height:120%!important } h2 { font-size:16px!important; text-align:left; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:20px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:16px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:10px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:14px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }</style></head>
  <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><form class="form" style="max-width: none; width: 1000px;height:800px;margin: 0 auto;">  
  <div id="dvContainer" style="width:100%;" >
              <div class="container-fluid" >
                  <div
                      style="margin-top: 15px;width: 100%;/* margin: 0px auto; /margin: auto;padding:15px;background-image : url('images/13 (1).png');background-size: cover;/ height: 98%; */margin-bottom: 15px;">
                      <div style="width: 98%;margin:0 auto;border: 2px #fff solid;border-radius: 40px;padding: 30px;">
                          <div style="width:100%;display: flex;">
                              <div style="width:50%;">
                                  <h1 class="font-barlow-m" style="color:#fff;">VERIFIED<br>CERTIFIED</h1>
                              </div>
                              <div style="width:50%;text-align: end;">
                                  <h1 class="font-barlow-m" style="color:#fff;font-weight: 700;" class=""><?=$event_name?></h1>
                              </div>
                          </div>
                          <div style="width:100%;display: flex;margin-top:20px;">
                              <h5 class="font-barlow-r" style="color:#fff;font-weight: 300;">This is to certify that</h5>
                          </div>
                          <div style="width:100%;margin-top:20px">
                              <h1 class="font-barlow-m" style="color:#fff;font-weight: 700;" class=""><?=$customername?></h1>
                          </div>
                          <div style="width:100%;display: flex;">
                              <div style="width:60%;margin-top:20px;">
                                  <div style="width:100%;display: flex;">
                                      <h5 class="font-barlow-r" style="color:#fff;font-weight: 300;"><?=$after_name?> </h5>
                                  </div>
                                  <div  style="width:100%;margin-top:20px">
                                      <h1 class="font-barlow-m" style="color:#fff;font-weight: 700;" ><?=$event_topic?>
                                      </h1>
                                      <h5 class="font-barlow-r" style="color:#fff;font-weight: 100;margin-top:15px;"><?=$after_topic?> </h5>
                                  </div>
                              </div>
                              <div
                                  style="width:40%;text-align: right;display: flex;align-items: flex-end;/* margin-top:20px; */">
                                  <div style="width:100%;text-align: right;">
                                      <img src="images/14.png" width="150px" height="100px">
                                      <h5 class="font-barlow-m" style="color:#fff;">Bandhul Bansal</h5>
                                      <h5 class="font-barlow-r" style="font-weight: 200;font-size: 18px;color: #fff;">Founder Finstreet</h5>
                                  </div>
                              </div>
                          </div>
                          <div style="width:100%;display: flex;padding-bottom: 30px;">
                              <div style="width:60%;margin-top: 80px;">
                                  <p class="navbar-brand color-blue border-right "
                                      style="padding: 0 10px;margin: 20px 0px;border: 1px solid #fff;"><span
                                          class="font-calps-r color-white" style="font-size: 25px;">Fin</span><span
                                          class="font-barlow-eb color-white" style="font-size: 25px;">ST₹EET</span></p>
                                  <span style="color:#fff;" class="font-barlow-r"> In Association With </span>
                                  <img src="images/18 (1).png" style="background-color: #fff;width: 60px;margin: 0 10px;"><img src="<?=$broughtuby[0]?>" style="width: 80px;">
                              </div>
                              <div style="width:40%;margin-top: 80px;display: flex;align-items: flex-end;">
                                  <div style="width:100%;text-align: end;">
                                      <p class="font-barlow-m mb-0" style="color: #dee2e61a;font-weight: 500;">Issue Date: <?=$issue_date?></p>
                                      <p class="font-barlow-m mb-0" style="color: #dee2e61a;font-weight: 500;">VALID CERTIFICATE ID: 1999320C202083877680</p>
                                  </div>
                              </div>
                          </div>
  
                      </div>
                  </div>
              </div>
          </div>
      </form></body></html>`;
  return template;
};
