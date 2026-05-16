import React, { useState } from 'react';

function Contact() {
  const [champs, setChamps] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [envoye, setEnvoye] = useState(false);
  const [erreurs, setErreurs] = useState({});

  const valider = () => {
    const e = {};
    if (!champs.nom.trim())     e.nom     = 'Le nom est obligatoire';
    if (!champs.email.trim())   e.email   = "L'email est obligatoire";
    else if (!/\S+@\S+\.\S+/.test(champs.email)) e.email = 'Email invalide';
    if (!champs.message.trim()) e.message = 'Le message est obligatoire';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChamps((prev) => ({ ...prev, [name]: value }));
    if (erreurs[name]) setErreurs((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = valider();
    if (Object.keys(v).length > 0) { setErreurs(v); return; }
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <div className="contact">
        <div className="contact-succes">
          <div className="contact-succes-icone">✓</div>
          <h2>Message envoyé !</h2>
          <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
          <button className="btn btn-principal" onClick={() => { setEnvoye(false); setChamps({ nom:'',email:'',sujet:'',message:'' }); }}>
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact">
      <div className="contact-entete">
        <h1>Contactez-moi</h1>
        <p>Une question, une opportunité ? Je suis disponible et vous répondrai rapidement.</p>
      </div>

      <div className="contact-contenu">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="champ-row">
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="nom">Nom <span className="champ-requis">*</span></label>
              <input id="nom" name="nom" type="text"
                className={`champ-input${erreurs.nom ? ' champ-erreur' : ''}`}
                placeholder="Votre nom" value={champs.nom} onChange={handleChange} />
              {erreurs.nom && <span className="erreur-msg">{erreurs.nom}</span>}
            </div>
            <div className="champ-groupe">
              <label className="champ-label" htmlFor="email">Email <span className="champ-requis">*</span></label>
              <input id="email" name="email" type="email"
                className={`champ-input${erreurs.email ? ' champ-erreur' : ''}`}
                placeholder="votre@email.com" value={champs.email} onChange={handleChange} />
              {erreurs.email && <span className="erreur-msg">{erreurs.email}</span>}
            </div>
          </div>

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="sujet">Sujet</label>
            <input id="sujet" name="sujet" type="text"
              className="champ-input"
              placeholder="Sujet de votre message" value={champs.sujet} onChange={handleChange} />
          </div>

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="message">Message <span className="champ-requis">*</span></label>
            <textarea id="message" name="message" rows={6}
              className={`champ-input champ-textarea${erreurs.message ? ' champ-erreur' : ''}`}
              placeholder="Votre message…" value={champs.message} onChange={handleChange} />
            {erreurs.message && <span className="erreur-msg">{erreurs.message}</span>}
          </div>

          <button type="submit" className="btn btn-principal">Envoyer le message</button>
        </form>

      </div>
    </div>
  );
}

export default Contact;
