const Sauce = require('../models/Sauce');
const fs = require('fs');
const router = require('../routes/sauce');

exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};


exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            _id: req.params.id
        })
        .then(sauce => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(sauce => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(404).json({
                        error
                    }))
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.like = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like
    let message = "";

    if ( userId == null || like == null ) {
        return res.status(400).json( { message: "userId ou like manquant" } );
    }

    Sauce.findOne( { _id: req.params.id } )
        .then(sauce => {
            switch (like) {
                
                case 1:
                    sauce.usersLiked.push( userId );
                    sauce.likes += 1;
                    message = "Vous avez like cette sauce";
                    break;
                case 0:
                    if ( sauce.usersDisliked.includes( userId ) ) {
                        sauce.usersDisliked.splice( sauce.usersDisliked.indexOf( userId ));
                        sauce.dislikes -= 1;
                    }
                    if ( sauce.usersLiked.includes( userId ) ) {
                        sauce.usersLiked.splice( sauce.usersLiked.indexOf( userId ));
                        sauce.likes -= 1;
                    }
                    message = "Vous etes neutre";
                    break;
                case -1:
                    sauce.usersDisliked.push( userId );
                    sauce.dislikes += 1;
                    message = "Vous avez dislike cette sauce";
                    break;
            }
            sauce.save()

            return res.status(200).json( { message } )
        })
        .catch(error => res.status(404).json({
            error
        }));
}
