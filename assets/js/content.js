(function ($) {
    let PageBody= $('body');
    let wpas_import_ext={};
    let items=[];
    let buttonDoms;
console.log("its working");
//send message to background page
document.documentElement.setAttribute('amazonxtra-extension-installed', true);
window.addEventListener("message", (event)=>{
    
    if (event.source != window) return;
    
    if (event.data.type && (event.data.type == "search")) {
        console.log( event.data.url);
        chrome.runtime.sendMessage({
            url:event.data.url, 
            type: event.data.type, 
            search_string:event.data.search_string,
        }, request_response_hanlder);
    }
});
function request_response_hanlder(response){
     let itemHtml="";
     console.log(response);
     let items=$(response.result).find('.s-asin');
     //WpasExHelper.importRecur(0);
     
     //console.log(items.length)
     if(items.length>0){
         items.each(function (index) {
            let item = $(this);
            let count = items.length;
            console.log(count);
            let itemData=WpasExLoader.extractItemData(item);
            if(itemData.asin!=null){
                console.log(itemData.url)
                WpasExHelper.importRecur(0);
                itemHtml+=WpasExLoader.searchItemDom(itemData);
                //console.log(itemHtml)
                //console.log(items.length)
                //detailsRequest
                detailsRequest(itemData,count); 
                //chrome.runtime.sendMessage({url:itemData.url, type:'details',asin:itemData.asin,thumb:itemData.thumb,price:itemData.price,item:itemData}, WpasExHelper.detailsResponseHadler);
             }
         });
     }else{
          itemHtml+="No Products Found!";
     }
     //console.log(response.search_string)
     WpasExHelper.searchRequest(itemHtml,response.search_string,response.page);
  }
function detailsRequest(itemData,count){

    console.log("2nd link=",itemData.url);
    chrome.runtime.sendMessage({url:itemData.url, type:'details',asin:itemData.asin,count:count}, WpasExHelper.detailsResponseHadler);
    
    //chrome.runtime.sendMessage({url:itemData.url, type:'details',asin:itemData.asin,thumb:itemData.thumb,price:itemData.price,item:itemData}, WpasExHelper.detailsResponseHadler);

}
//response formatter
let WpasExtFormatter={
    getBody:function (result) {
        
        let bodyHtml="";
        let title=WpasExtFormatter.getTitle(result);
        //console.log(title);
        //let QA=WpasExtFormatter.getQA(result);
        let review=WpasExtFormatter.getreview(result);
        let totalRatings=WpasExtFormatter.getTotalRatings(result);
        let topreview=WpasExtFormatter.gettopreview(result);
        let details=WpasExtFormatter.getDetails(result);



         let images=WpasExtFormatter.getImages(result);
        // let attrs=WpasExtFormatter.getAttrs(result);
         let brand=WpasExtFormatter.getBrand(result);
        // let author=WpasExtFormatter.getAuthor(result);
        // let amznPrice=WpasExtFormatter.getAznPrice(result);
        // let listPrice=WpasExtFormatter.getListPrice(result);
         let desc=WpasExtFormatter.getDesc(result);
        let shortDesc=WpasExtFormatter.getShortDesc(result);
        // let cat=WpasExtFormatter.getCat(result);
        // let spec=WpasExtFormatter.getSpec(result);
        // bodyHtml+=title+attrs+images+brand+author+amznPrice+listPrice+desc+shortDesc+cat+spec;
       //bodyHtml+=shortDesc+title;
         bodyHtml+=title+totalRatings+review+topreview+shortDesc+details;

        //bodyHtml+=images+title;
         //bodyHtml+="</td>";
         return bodyHtml.replace(/(^[ \t]*\n)/gm, "");
    },
    getTitle:function (result) {
        let titleHtml="";
        if($(result).find('#productTitle').length>0){
            titleHtml+='<td id="productTitle">'+$(result).find('#productTitle').text().trim()+'</td>';
        }else if($(result).find('#mas-title').length>0){
            titleHtml+='<td id="mas-title">'+$(result).find('#mas-title').first().text().trim()+'</td>';
        }else if($(result).find('#ebooksProductTitle').length>0){
            titleHtml+='<td id="ebooksProductTitle">'+$(result).find('#ebooksProductTitle').first().text().trim()+'</td>';
        }
        return titleHtml;
    },
    getreview:function (result) {
        let reviewHtml="";
        
        if($(result).find('#acrPopover').length>0){
         reviewHtml+='<td id="total_review">'+$(result).find('#acrPopover').first().text()+'</td>';
  
        //     $(result).find('.a-declarative').each(function(index){
        //         reviewHtml+='<td id="review">'+$(result).find('#acrPopover').find('a-offscreen').first().text() +'</td>'
        //     //brandHtml+='<td id="brand">'+$(result).find('.po-break-word').first().text().trim()+'</td>';

        
        // })
        // if($(result).find('#priceblock_ourprice').length>0){
        //     amzPriceHtml+='<div id="priceblock_ourprice">'+$(result).find('#priceblock_ourprice').first().html()+'</div>';
        // }else if($(result).find('#priceblock_dealprice').length>0){
        //     amzPriceHtml+='<div id="priceblock_dealprice">'+$(result).find('#priceblock_dealprice').first().html()+'</div>';
         }
        return reviewHtml;

    },
    gettopreview:function (result) {
        let TopreviewHtml="<td id='shortDec'>\n";
        let topreviewnameHtml="";
        let topreviewtitleHtml="";
        let topreviewHtml="";
        
        
        if($(result).find('#cm-cr-dp-review-list').length>0){
         $(result).find('#cm-cr-dp-review-list').find('.review').each (function(index){
        topreviewnameHtml='<li>'+$(this).find('.a-spacing-mini').find('.a-profile-content').find('.a-profile-name').text() +'</li>'
        topreviewtitleHtml='<li>'+$(this).find('.review-title-content').find('span').text() +'</li>'
        topreviewHtml='<li>'+$(this).find('.review-data').find('.review-text').find('.reviewText span').text() +'</li>'
         TopreviewHtml=topreviewnameHtml+topreviewtitleHtml+topreviewHtml;
            });
           TopreviewHtml+="</td>"


        
        //     $(result).find('.a-declarative').each(function(index){
        //         reviewHtml+='<td id="review">'+$(result).find('#acrPopover').find('a-offscreen').first().text() +'</td>'
        //     //brandHtml+='<td id="brand">'+$(result).find('.po-break-word').first().text().trim()+'</td>';

        
        // })
        // if($(result).find('#priceblock_ourprice').length>0){
        //     amzPriceHtml+='<div id="priceblock_ourprice">'+$(result).find('#priceblock_ourprice').first().html()+'</div>';
        // }else if($(result).find('#priceblock_dealprice').length>0){
        //     amzPriceHtml+='<div id="priceblock_dealprice">'+$(result).find('#priceblock_dealprice').first().html()+'</div>';
         }
        return TopreviewHtml;

    },
    getQA:function (result) {
        let QAHtml="";
        // $(result).find('.askBtfTopQuestionsContainert').each(function (index) {
        //     if($(this).text().indexOf('.a-fixed-left-grid a-spacing-base')>=0 ){
        //         QAHtml='<script>'+WpasExtFormatter.getQA($(this).text())+'</script>';
        //     }
        // });

         if($(result).find('.askBtfTopQuestionsContainer').length>0){
            QAHtml+='<div id="QA">'+$(result).find('.askBtfTopQuestionsContainer').first().text()+'</div>';
         }
        //$(result).find('.a-fixed-left-grid-col a').each(function(index){
            //QAHtml+=+$(this).find('span').text() 
            //brandHtml+='<td id="brand">'+$(result).find('.po-break-word').first().text().trim()+'</td>';

        
        //})
        // if($(result).find('#productTitle').length>0){
        //     titleHtml+='<td id="productTitle">'+$(result).find('#productTitle').first().text().trim()+'</td>';
        // }else if($(result).find('#mas-title').length>0){
        //     titleHtml+='<td id="mas-title">'+$(result).find('#mas-title').first().text().trim()+'</td>';
        // }else if($(result).find('#ebooksProductTitle').length>0){
        //     titleHtml+='<td id="ebooksProductTitle">'+$(result).find('#ebooksProductTitle').first().text().trim()+'</td>';
        // }
        return QAHtml;
    },
    getTotalRatings:function (result) {
        let totalRatingsHtml="";
        if($(result).find('#acrCustomerReviewText').length>0){
            totalRatingsHtml+='<td id="total_rating">'+$(result).find('#acrCustomerReviewText').first().text()+'</td>';
        }
        return totalRatingsHtml;
    },
    getAttrs:function (result) {
        let attrHtml="";
        $(result).find('script').each(function (index) {
            if($(this).text().indexOf('variationValues')>=0 && $(this).text().indexOf('dimensionValuesDisplayData')>=0){
                attrHtml='<script>'+WpasExtFormatter.getAttrString($(this).text())+WpasExtFormatter.getVariString($(this).text())+'</script>';
            }
        });
        return attrHtml;
    },
    getAttrString:function(raw){
        let strings=raw.split('variationValues');
        let stringParts=strings[1].split("}");
        return '"variationValues'+stringParts[0]+'} ';
    },
    getVariString:function(raw){
        let strings=raw.split('dimensionValuesDisplayData');
        let stringParts=strings[1].split("}");
        return '"dimensionValuesDisplayData'+stringParts[0]+'}';
    },
    getImages:function (result) {
        let imageHtml="";
        // $(result).find('script').each(function (index) {
        //     //Images
        //     if($(this).text().indexOf('ImageBlockATF')>=0 && $(this).text().indexOf('initial')>=0 ){
        //         imageHtml='<script>'+WpasExtFormatter.getImageString($(this).text())+'</script>';
        //         return false;
        //     }else if($(this).text().indexOf('ImageBlockATF')>=0){
        //         imageHtml='<script>'+WpasExtFormatter.getImageString($(this).text())+'</script>';
        //         return false;
        //     }
        // });
        if($(result).find('#altImages ul li ').length>0){
                $(result).find('#altImages ul li ').each(function(index){
                    imageHtml+= $(this).find('.imageThumbnail').find('.a-button-text').find('img').attr('src')+'\n';
                });
        }
        
        return imageHtml;
    },
    getImageString:function(string){
        //let urls="";
        //let matches = string.match(/\bhttps?:\/\/\S+(jpg)/gi);
        //let matches = string.match(/\bhttps?:\/\/([a-zA-Z-_]).([a-zA-Z-_]).([a-z])\S+.(jpg)/gi);
        return string;
    },
    getBrand:function (result) {
        let brandHtml="";
        if($(result).find('.po-brand').length>0){
            brandHtml+='<td id="brand">'+$(result).find('.po-break-word').first().text().trim()+'</td>';
            //brandHtml+='<td id="bylineInfo">'+$(result).find('#bylineInfo').first().text().trim()+'</td>';
        }
        return brandHtml;
    },
    getAuthor:function (result) {
        let authorHtml="";
        if($(result).find('#bylineInfo').length>0){
            authorHtml+='<div id="bylineInfo">'+$(result).find('#bylineInfo').first().text().trim()+'</div>';
        }
        return authorHtml;

    },
    getAznPrice:function (result) {
        let amzPriceHtml="";
        if($(result).find('#priceblock_ourprice').length>0){
            amzPriceHtml+='<div id="priceblock_ourprice">'+$(result).find('#priceblock_ourprice').first().html()+'</div>';
        }else if($(result).find('#priceblock_dealprice').length>0){
            amzPriceHtml+='<div id="priceblock_dealprice">'+$(result).find('#priceblock_dealprice').first().html()+'</div>';
        }
        return amzPriceHtml;

    },
    getListPrice:function (result) {
        let listPriceHtml="";
        if($(result).find('#price.a-text-strike').length>0){
            listPriceHtml+='<div id="price.a-text-strike">'+$(result).find('#price.a-text-strike').first().html()+'</div>';
        }
        return listPriceHtml;
    },
    getDesc:function (result) {
        let descHtml="";
        if($(result).find('#productDescription').length>0){
            descHtml+='<div id="productDescription">'+$(result).find('#productDescription').first().html()+'</div>';
        }
        else if($(result).find('#mas-product-description').length>0){
            descHtml+='<div id="mas-product-description">'+$(result).find('#mas-product-description').first().html()+'</div>';
        }else if($(result).find('#featurebullets_feature_div ul li').length>0){
            descHtml+='<div id="featurebullets_feature_div">'+$(result).find('#featurebullets_feature_div').first().html()+'</div>';
        }else if($(result).find('#mas-product-feature ul li').length>0){
            descHtml+='<div id="mas-product-feature">'+$(result).find('#mas-product-feature').first().html()+'</div>';
        }
        return descHtml;

    },
    getShortDesc:function (result) {
        let ShortdescHtml="<td id='shortDec'>\n";
     if($(result).find('#feature-bullets ul li').length>0){

      $(result).find('#feature-bullets ul li').each(function(index){
            ShortdescHtml+= '<li >'+$(this).find('span').text().trim()+'</li>\n';
      // //         //ShortdescHtml+='<td id="shortDec">'+$(index).find('.a-list-item').text().trim()+'</td>';
       })
       ShortdescHtml+="</td>";

       }
      if($(result).find('#bookDescription_feature_div').length>0){

       $(result).find('#bookDescription_feature_div').each(function(index){
       ShortdescHtml+= '<li >'+$(this).find('span').text().trim()+'</li>\n';
        // // //ShortdescHtml+='<td id="shortDec">'+$(index).find('.a-list-item').text().trim()+'</td>';
       })
       ShortdescHtml+="</td>";
       }
        
            
            
            return ShortdescHtml;

    },
    getCat:function (result) {
        let catHtml="";
        if($(result).find('#wayfinding-breadcrumbs_feature_div').length>0){
            catHtml+='<div id="wayfinding-breadcrumbs_feature_div">'+$(result).find('#wayfinding-breadcrumbs_feature_div').first().html()+'</div>';
        }else if($(result).find('#wayfinding-breadcrumbs_container').length>0){
            catHtml+='<div id="wayfinding-breadcrumbs_container">'+$(result).find('#wayfinding-breadcrumbs_container').first().html()+'</div>';
        }
        return catHtml;
    },
    getSpec:function (result) {
        let specHtml="";
        if($(result).find('#productDetails_techSpec_section_1').length>0){
            specHtml+='<div id="wayfinding-productDetails_techSpec_section_1">'+$(result).find('#productDetails_techSpec_section_1').first().html()+'</div>';
        }else if($(result).find('#detail-bullets table .content ul').length>0){
            specHtml+='<div id="detail-bullets">'+$(result).find('#detail-bullets').first().html()+'</div>';
        }else if($(result).find('#detailBullets_feature_div ul').length>0){
            specHtml+='<div id="detailBullets_feature_div">'+$(result).find('#detailBullets_feature_div').first().html()+'</div>';
        }
        return specHtml;

    },
    getDetails:function(result){
         let details = "<td><table>";
         if($(result).find('#productDetails_detailBullets_sections1').length>0){
             $(result).find('#productDetails_detailBullets_sections1 tr').each(function(index){
                 var detailsTitle = $(this).find('.prodDetSectionEntry').text();
                 var detailsattr = $(this).find('td').text();
                 //details+= "<th>"+detailsTitle+"</th>\n<td>"+detailsattr+"</td>"
        //         //details+=detailsattr
                details+='<tr><th>'+detailsTitle+'</th></tr>';
                 details+='<tr><td>'+detailsattr+'</td></tr>';
             });  
           details+="</table></td>"

         }
         if($(result).find('#detailBullets_feature_div').length>0){
             $(result).find('#detailBullets_feature_div ul li').each(function(index){
               var detailsTitle = $(this).find('h2').text();
               var detailsattr = $(this).find('span').text();
        //         //details+= "<th>"+detailsTitle+"</th>\n<td>"+detailsattr+"</td>"
        //         //details+=detailsattr
                details+='<tr><th>'+detailsTitle+'</th></tr>';
                details+='<tr><td>'+detailsattr+'</td></tr>';
             });
             details+="</table></td>"
 
        }
        

        return details;
    },
 

    
};
//Helper
let WpasExHelper={
    ajax: function (data) {
        //console.log(data.url)
        // $.post('/help.php', function(data,status){
        //     console.log(data)
        // });//Ajax url,Data
        
        return $.post('', data);
    },
    preLoader: function () {
        return '<div class="wpas-ajax-pre-loader-container" ><img  class="wpas-ajax-pre-loader" src="' + wpas_import_ext.image_path + 'pre-loader.gif" alt="Loadding..." /></div>';
    },
    closestValue: function (myArray, myValue) {
        //optional
        let i = 0;
        while (myArray[++i] < myValue) ;
        return myArray[--i];
    },
    pagination: function (pages, current) {
        let pagiNation="";
        if (current > 1) {
            let previousPage = parseInt(current - 1);
            pagiNation += '<li class="acl-product-import-previous" data-val="' + previousPage + '">Previous</li>';
        } else {
            pagiNation += '';
        }
        //pagninator array builder
        let paginator = [];
        for (let i = 1; i <= pages; i++) {
            paginator.push(i)
        }
        let paginPages = [];
        for (let i = 1; i <= 5; i++) {
            let nearVal = this.closestValue(paginator, current);
            paginPages.push(nearVal);
            let index = paginator.indexOf(nearVal);
            if (index !== -1) paginator.splice(index, 1);
        }
        if (current != 1) {
            paginPages.push(parseInt(current))
        }
        //Removing Duplicates
        paginPages = paginPages.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        //sorting as ascending
        paginPages.sort();
        for (let i = paginPages[0]; i <= paginPages.length; i++) {
            if (current == i) {
                pagiNation += '<li class="acl-pagination-item-active" data-val="' + i + '">' + i + '</li>';
            } else {
                pagiNation += '<li data-val="' + i + '">' + i + '</li>';
            }
        }
        if (current < pages) {
            let nextPage = parseInt(parseInt(current) + 1);
            pagiNation += '<li class="acl-product-import-next" data-val="' + nextPage + '">Next</li>';
        }

        return pagiNation;
    },
    saveInCache:function(searchString) {
        if (sessionStorage.getItem("wpasImport")) {
            let wpasCache = JSON.parse(sessionStorage.getItem("wpasImport"));
            //checking request
            let matchedItems = wpasCache.filter(function (item) {
                return item['key'] == searchString;
            });
            if (matchedItems.length > 0) { // if it is already exist then update
                let remainItems = wpasCache.filter(function (item) {
                    return item['key'] != searchString;
                });
                let wpasCacheItem = {
                    'key': searchString,
                    'value': btoa(unescape(encodeURIComponent($('.wpas-no-aws-import-products-row').html())))
                };
                remainItems.push(wpasCacheItem);
                sessionStorage.setItem("wpasImport", JSON.stringify(remainItems));
            } else { // if not exist then insert
                let wpasCacheItem = {
                    'key': searchString,
                    'value': btoa(unescape(encodeURIComponent($('.wpas-no-aws-import-products-row').html())))
                };
                wpasCache.push(wpasCacheItem);
                sessionStorage.setItem("wpasImport", JSON.stringify(wpasCache));
            }
            //console.log(wpasCache)
        } else {
            let wpasCache = [];
            let wpasCacheItem = {
                'key': searchString,
                'value': btoa(unescape(encodeURIComponent($('.wpas-no-aws-import-products-row').html())))
            };
            wpasCache.push(wpasCacheItem);
            sessionStorage.setItem("wpasImport", JSON.stringify(wpasCache));
        }
    },
    selectProductCount:function() {
        $('#import-selected-products').text($(".acl-product-box-remove").length);
        if ($(".acl-product-box-remove").length == 0) {
            $('.wpas-no-aws-import-products-queue-section').hide();
        }
    },
    logList:function(sku, message, className, type) {
        let li="";
        if (type == 'variable') {
             li = '<li id="' + sku + '" class="' + className + '" style="display:none"><span>' + sku + '</span> ' + message + '</li>';
        } else {
            li = '<li class="' + className + '"><span>' + sku + '</span> ' + message + '</li>';
        }
        if (typeof sku !== 'undefined' && typeof message !== 'undefined') {
            $('.product-log-list').append(li);
        }

    },
    logMessages:function(message, className) {
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let li = '<li class="' + className + '"> <strong>[ ' + time + ']</strong> ' + message + '</li>';
        if (typeof message !== 'undefined') {
            $('.product-log-message').append(li);
        }
    },
    searchRequest:function(itemHtml) {
        //let data = {'action': 'wpas_no_pa_search_ext', 'search_result': searchResult};
        //let request = this.ajax(data);
        //request.done(function (response) {

            //$('.wpas-no-aws-import-products-section,.wpas-no-pa-add-all-container').show();
            //console.log(itemHtml);
            $('.table-data').html(itemHtml);
            //Pagination and caching will be worked only for product search.
            //$('.acl-pagination-section').show();
            $('.acl-product-import-pagination').html(WpasExHelper.pagination(10, page));
            //$('#wpas-search-string').val(searchString);
                //Saving and updating result into cache
            WpasExHelper.saveInCache(searchString);
        //});
    },
    detailsResponseHadler:function(xHttpRes){
       console.log(xHttpRes.count);
        items=WpasExtFormatter.getBody(xHttpRes.result);
        console.log(items)
        //WpasExLoader.check(items);
        let itemHtml="";
        //for (let i = 0; i <= xHttpRes.count; i++) {
            itemHtml+=WpasExLoader.searchItemDom(items);
            //WpasExLoader.preLoader()
       // }
        WpasExHelper.searchRequest(itemHtml);
    },
   
    importRecur : function(item){
        // console.log(item);
        // Current button
        //let buttonDoms = $(".acl-product-box-remove");
        //let buttonDom = $(buttonDoms[item]);
        // if (item < buttonDoms.length) {
        //     buttonDom.parent().addClass('acl-product-box-importing-from-queue');
        //     Message to start
        //     WpasExHelper.logMessages(buttonDom.attr('data-asin') + ' start to import.', '');
        //     Sending to get data.
            // chrome.runtime.sendMessage({url:buttonDom.attr('data-url'), type:'details',asin:buttonDom.attr('data-asin'),thumb:buttonDom.attr('data-thumb'),price:buttonDom.attr('data-price'),item:item}, WpasExHelper.detailsResponseHadler);
        //    Happy request.
        // }
    },
    variationsSave:function(parent_sku, parent_id, variations, variationCounter) {
        let variationNum = parseInt(wpas_import_ext.variation_number);
        let totalVariants = variations.length;
        if (totalVariants <= variationNum) {
            variationNum = totalVariants;
        }
        if (variationCounter < variationNum) {
            WpasExHelper.logMessages(variations[variationCounter].sku + ' variant for ' + parent_sku + ' is started to import', '');
            //Sending to get data.
            chrome.runtime.sendMessage({url:variations[variationCounter].variation_url, type:'variation',sku:variations[variationCounter].sku,variations:variations,parent_sku:parent_sku,parent_id:parent_id,variation_counter:variationCounter}, WpasExHelper.variationResponsehanlder);

        } else {
            $('.product-log-list #' + parent_sku).show();
        }
    },
    variationResponsehanlder:function (response) {
        let parent_sku=response.parent_sku,parent_id=response.parent_id,variations=response.variations,variationCounter=response.variation_counter;
        console.log(response)

        let data = {
            'action': 'wpas_product_variation_insert_ext',
            'parent_sku': parent_sku,
            'parent_id': parent_id,
            'sku': response.sku,
            'details': btoa(encodeURIComponent(response.result)),
            'variation': variations[variationCounter],
        };

        let request = WpasExHelper.ajax(data);
        request.done(function (response) {
            if (response.status == 200) {
                WpasExHelper.logMessages(response.sku + ' ' + response.message, 'log-message-success');
                variationCounter++;
                WpasExHelper.variationsSave(parent_sku, parent_id, variations, variationCounter);
            } else {
                variationCounter++;
                WpasExHelper.variationsSave(parent_sku, parent_id, variations, variationCounter);
                WpasExHelper.logMessages(response.sku + ' ' + response.message, 'log-message-fail');
            }

        }).fail(function (response) {
            variationCounter++;
            WpasExHelper.variationsSave(parent_sku, parent_id, variations, variationCounter);
        });
    }
};

let WpasExLoader={
    // try to box get template file
    LoadImportTemplate:function() {
        // Adding Template using Js
        let importTeplate = $.get(chrome.extension.getURL('../templates/importer.html'), function (data) {
        }, 'html');
        importTeplate.done(function (data) {
            PageBody.append( data );
        })
        .fail(function () {
            //chrome notice here
            //console.log('load_box_failed', 'load_box_failed_desc', 'error');
        });
        /*chrome.extension.sendMessage({'type':'template',cmd: "read_file"}, function(html){
            console.log(html);
            PageBody.append( html );
        });*/
    },
    findStoreFromURL: function( url ) {
        var pattern =/https?:\/\/(?:.+\.)amazon\.([^\/]*)/i;
        var matches=pattern.exec( url );
        if(matches!==null && matches[1]){
           return matches[1];     
        }else{
            return null;
        }
    },

    findASINWithURL: function( url ) {
        var pattern =/\/(?:dp|(?:gp\/product))\/([^\/|\?]+)(?:\/|\?)?/i;
        var matches=pattern.exec( url );
        if(matches!==null && matches[1]){
           return matches[1];     
        }else{
            return null;
        }
    },
    addQueBtn:function () {
        if($('.s-result-item').length>0){
           $('.s-result-item').each(function (index) {
               let currentProduct=$(this);
               currentProduct.css('position', 'relative');
               let buttonDom=WpasExLoader.itemButtomDom(currentProduct);
               currentProduct.append(buttonDom);
            });
        }
    },
    itemExist:function(items,asin){
        let hasIn=items.filter(function (obj) {
            return obj.asin == asin;
        });
        if(hasIn.length>0){
            return true;
        }else{
            return false;
        }
    },
    extractItemData:function(product){
        let title=product.find('h2').text();
        let asin =product.attr('data-asin');
        //console.log(as);
        let titleUrl=product.find('a').attr('href');
        //let asin=WpasExLoader.findASINWithURL(titleUrl);
        //console.log(asin);
        let url="https://www.amazon.com"+'/dp/'+asin;//"https://www.amazon.com/"+titleUrl;//
        let thumb=product.find('img').attr('src');
        let price=product.find('.a-price>span').first().text();
        //return {'asin':asin, 'title':title.trim(), 'url':url, 'thumb':thumb, 'price':price};
        return {'url':url, 'asin':asin};
    },
    searchItemDom:function(item){
        // return'<div class="acl-col-md-2-ex">\n' +
        //     '    <div class="acl-product-box" id="wpas-import-ASIN">\n' +
        //     '    <div class="acl-product-box-thumb">\n' +
        //     '            <img src="'+item.thumb+'" alt="'+item.title+'">\n' +
        //     '        </div>\n' +
        //     '     <div class="acl-product-box-info">\n' +
        //     '            <h3 title="'+item.title+'"> '+item.title+'</h3>\n' +
        //     '            <h4>'+item.price+'</h4>\n' +
        //     '        </div>\n' +
        //     '        <div class="acl-product-box-action">\n' +
        //     '            <button type="button" data-asin="'+item.asin+'" data-title="'+item.title+'" data-price="'+item.price+'" data-url="'+item.url+'" data-thumb="'+item.thumb+'">Add to Import Queue</button>\n' +
        //     '        </div>\n' +
        //     '    </div>\n' +
        //     '</div>';
        let a= '<tr>\n'
        a+= item;
        a+='</tr>';
        return a;
            
        //console.log(item);
    },
    itemButtomDom:function (product) {
        let title=product.find('h2').text();
        let titleUrl=product.find('a').attr('href');
        let asin=WpasExLoader.findASINWithURL(titleUrl);
        let url='https://'+window.location.hostname+'/dp/'+asin;
        let thumb=product.find('img').attr('src');
        let price=product.find('.a-price>span').first().text();
        let label='Add to Import Queue';
        //checking LocalStorage & setting label
        if(localStorage.getItem('items')){
            items=JSON.parse(localStorage.getItem('items'));
            if(items.length>0 && WpasExLoader.itemExist(items,asin)){
                label='Queued';
            }
        }
        return '<div id="wpas-importer'+asin+'" class="wpas-import-external-box-item" data-title="'+title.trim()+'" data-thumb="'+thumb+'" data-url="'+url+'" data-asin="'+asin+'" data-price="'+price+'">'+label+'</div>';
    },
    detailBtnDom:function(uRl){

        let thumb="",title="",price="";
        let asin =WpasExLoader.findASINWithURL(uRl);
        let url='https://'+window.location.hostname+'/dp/'+asin;
        if($('#imgTagWrapperId').length>0){
            thumb=$('#imgTagWrapperId').find('img').attr('src');
        }
        if($('#title').length>0){
            let title=$('#title').text();
        }
        let label='Add to Import Queue';
        //checking LocalStorage & setting label
        if(localStorage.getItem('items')){
            items=JSON.parse(localStorage.getItem('items'));
            if(items.length>0 && WpasExLoader.itemExist(items,asin)){
                label='Queued';
            }
        }
        return '<div id="wpas-importer'+asin+'" class="wpas-import-external-box-item" data-title="'+title.trim()+'" data-thumb="'+thumb+'" data-url="'+url+'" data-asin="'+asin+'" data-price="'+price+'">'+label+'</div>';

    },
    itemDom:function (item) {
        return '<div class="acl-col-md-2">'+
            '<div class="acl-product-box">'+
            '<div class="acl-product-box-remove" data-thumb="'+item.thumb+'" data-url="'+item.url+'" data-asin="'+item.asin+'" data-price="'+item.price+'"></div>'+
            '<div class="acl-product-box-thumb">'+
            '<img src="'+item.thumb+'">'+
            '</div>'+
            '<div class="acl-product-box-info">'+
            '<h3>'+item.title+'</h3>'+
        '</div>'+
        '</div>'+
        '</div>';
    },
    itemAdd:function (items,itemData,flag) {
        let ret=false;
        if(items.length>0){
            if(flag=='add'){
                //checking the item is beloging to items or not
                if(WpasExLoader.itemExist(items,itemData.asin)){
                    ret=false;
                }else{
                    items.push(itemData)  ;
                    localStorage.setItem('items',JSON.stringify(items));
                    ret=true;
                }
            }
        }else{
              items.push(itemData)  ;
              localStorage.setItem('items',JSON.stringify(items));
              ret=true;
        }
        WpasExLoader.counterLabel(items);
        return ret;
    },
    counterLabel:function (items) {
        itemNumbers=items.length;
        $('.wpas-importer-ext-label,#import-selected-products').text(itemNumbers);
    },
    addImportLabel:function (asin) {
        if($("#wpas-importer"+asin).length>0){
            $("#wpas-importer"+asin).text('Add to Import Queue');
        }
    }
};

})(jQuery);