const proto = {
    init() {
        const userId = '3434570';
        const fetchItems = 60;
        let postArray = [];

        fetch('https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"3434570","first":60}')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let fetchedArray = myJson.data.user.edge_owner_to_timeline_media.edges;
                for (let i = 0; i < fetchedArray.length; i++) {
                    let postImage = fetchedArray[i].node.display_url;
                    let postText = fetchedArray[i].node.edge_media_to_caption.edges[0].node.text;
                    let postDesc;
                    // console.log(i, postText.indexOf('#'));
                    let bal = postText.indexOf('#');
                    if (bal > -1) {
                        postDesc = postText.slice(0, bal);
                    }
                    console.log(postDesc);
                }
            });
    }
};

export default Object.create(proto);
