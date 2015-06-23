</div>

<span id=doc-date>DATE</span>
<div id=doc-viewer class="doc-viewer">$annotatedHTML</div>
</div>

<script>

function updateDocumentFragmentHTML(docId) {
        jq.getJSON('${ ui.actionLink("getHTML") }',
            {
              'docId': docId
            })
        .success(function(data) {
            jq('#doc-viewer').html(data);
            var mention = getSelectedMentionCookie();
			highlightSelectedMention(mention);
			var mention_text = mention.split("-")[0];
			var scroll =  jq(findSpan(mention_text)).position().top+ jq(".doc-viewer").scrollTop() - 100
			console.log(scroll)
            jq('.doc-viewer').animate({
        		scrollTop: scroll
    			}, 1000);
            })
        }
        
function findSpan(mention_text)
{
	spans =  jq(".doc-viewer span")
	
	for(index in spans)
	{
		if(jq(spans[index]).text() == mention_text)
			return spans[index];
	}
}

</script>