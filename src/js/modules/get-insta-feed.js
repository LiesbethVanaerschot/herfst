const proto = {
    init() {
        const userId = '3434570';
        const fetchItems = 200;
        let postArray = [];
        const postGrid = document.getElementById('js-grid');

        fetch('https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"3434570","first":200}')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let fetchedArray = myJson.data.user.edge_owner_to_timeline_media.edges;
                for (let i = 0; i < fetchedArray.length; i++) {
                    let postImage = fetchedArray[i].node.display_url;
                    let postText = fetchedArray[i].node.edge_media_to_caption.edges[0].node.text;
                    let postDesc;
                    let postHashtagsPart;
                    let postHashtags;
                    let postObject = {};
                    let arrayToCheck = ['#herfstmensje_be'];
                    let filteredPost;
                    let bal = postText.indexOf('#');

                    if (bal > -1) {
                        postDesc = postText.slice(0, bal);
                        if (postDesc.length > 140) {
                            postDesc = postDesc.substring(0, 120) + '... ';
                        }
                        postHashtagsPart = postText.slice(bal, postText.length);
                        postHashtags = postHashtagsPart.match(/#[a-z0-9_]+/gi);
                        filteredPost = proto.matchArrays(postHashtags, arrayToCheck);
                        if (filteredPost.indicator) {
                            postObject = {
                                'image': postImage,
                                'text': postDesc,
                                'hashtags': filteredPost.hashtags
                            };

                            postArray.push(postObject);
                        }
                    }
                }

                if (proto.createFeed(postArray, postGrid)) {
                    let gridItems = document.querySelectorAll('.grid__item');
                    let body = document.body;
                    let preloader = document.querySelectorAll('.js-preloader');
                    for (let item of gridItems) {
                        setTimeout(function() {
                            item.classList.remove('hide');
                            preloader[0].classList.add('hide');
                            body.classList.remove('overflow');
                        }, 500);
                    }
                }
            });
    },
    matchArrays(base, toSearch) {
        let indicator = false;
        for (let i = 0; i < toSearch.length; i++) {
            let index = base.indexOf(toSearch[i]);
            if (index !== -1) {
                base.splice(index, 1);
                indicator = true;
            }
        }
        let returnValues = {
            'indicator': indicator,
            'hashtags': base
        };
        return returnValues;
    },
    createFeed(postArray, grid) {
        let posArray = ['center-center', 'center-top', 'center-bottom', 'right-center', 'left-center'];
        let sizeArray = ['item--medium', 'item--large', 'item--small'];

        for (let i = 0; i < postArray.length; i++) {
            let posClass = posArray[Math.floor(Math.random() * posArray.length)];
            let sizeClass = sizeArray[Math.floor(Math.random() * sizeArray.length)];
            let itemHashtag;
            let gridItem = document.createElement('div');
            let itemContent = document.createElement('div');
            let itemImage = document.createElement('img');
            let itemText = document.createElement('p');

            gridItem.classList.add('grid__item', 'hide', `${posClass}`);
            itemContent.classList.add('item__content', `${sizeClass}`);
            itemImage.classList.add('item__img');
            itemImage.src = postArray[i].image;
            itemText.classList.add('item__text');
            itemText.innerHTML = postArray[i].text;
            grid.appendChild(gridItem);
            gridItem.appendChild(itemContent);

            if (gridItem.classList.contains('center-bottom')) {
                itemContent.appendChild(itemText);
                itemContent.appendChild(itemImage);
            } else {
                itemContent.appendChild(itemImage);
                itemContent.appendChild(itemText);
            }

            for (let j = 0; j < postArray[i].hashtags.length; j++) {
                itemHashtag = document.createElement('span');
                itemHashtag.classList.add('item__hashtag');
                itemHashtag.innerHTML = `${postArray[i].hashtags[j]} `;

                itemText.appendChild(itemHashtag);
            }
        }

        return true;
    }
};

export default Object.create(proto);
