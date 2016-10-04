package org.openmrs.module.bannerprototype.nlp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.openmrs.Concept;
import banner.Sentence;
import banner.tokenization.Tokenizer;
import banner.tagging.Mention;
import com.sfsu.bannertrain.train.CRFTagger;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * this is a wrapper class for the BANNER CRF tagger
 * 
 * @author ryaneshleman
 */
public class NERTagger implements Serializable {
	
	private static final Log log = LogFactory.getLog(NERTagger.class);
	
	CRFTagger tagger;
	
	String taggerName;
	
	Tokenizer tokenizer;
	
	ArrayList<Mention> mentions;
	
	ArrayList<NamedEntity> namedEntities;
	
	public NERTagger() {
		log.debug("getting Tagger");
		tagger = TaggerFactory.getTagger();
		
		taggerName = TaggerFactory.getTaggerName();
		tokenizer = TaggerFactory.getTokenizer();
		
		mentions = new ArrayList<Mention>();
		namedEntities = new ArrayList<NamedEntity>();
		
	}
	
	/**
	 * Executes the BANNER CRF tagging. Takes a string as input and returns a list of NamedEntity
	 * objects found in the sentence.
	 * 
	 * @param sofa
	 * @return
	 */
	public ArrayList<NamedEntity> tag(String sofa) {
		// if the global configuration has changed since tagger was initialized
		if (TaggerFactory.isNewtaggerRequired(taggerName)) {
			log.debug("New Tagger Required");
			tagger = TaggerFactory.getTagger();
			taggerName = TaggerFactory.getTaggerName();
		}
		
		namedEntities.clear();
		
		List<Concept> matchedConcepts = new ArrayList<Concept>();
		
		mentions.clear();
		Sentence sentence = new Sentence(sofa);
		tokenizer.tokenize(sentence);
		
		//perform CRF tagging
		log.debug("Tagging Sentence with BANNER");
		tagger.tag(sentence);
		
		mentions.addAll(sentence.getMentions());
		
		//extract tags and construct NamedEntity objects
		for (Mention m : mentions) {
			namedEntities.add(new NamedEntity(m, matchedConcepts));
		}
		
		return namedEntities;
		
	}
	
}
