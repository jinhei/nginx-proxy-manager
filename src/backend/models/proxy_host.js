// Objection Docs:
// http://vincit.github.io/objection.js/

'use strict';

const db         = require('../db');
const Model      = require('objection').Model;
const User       = require('./user');
const AccessList = require('./access_list');

Model.knex(db);

class ProxyHost extends Model {
    $beforeInsert () {
        this.created_on  = Model.raw('NOW()');
        this.modified_on = Model.raw('NOW()');
        this.domain_names.sort();
    }

    $beforeUpdate () {
        this.modified_on = Model.raw('NOW()');
        if (typeof this.domain_names !== 'undefined') {
            this.domain_names.sort();
        }
    }

    static get name () {
        return 'ProxyHost';
    }

    static get tableName () {
        return 'proxy_host';
    }

    static get jsonAttributes () {
        return ['domain_names', 'meta'];
    }

    static get relationMappings () {
        return {
            owner:       {
                relation:   Model.HasOneRelation,
                modelClass: User,
                join:       {
                    from: 'proxy_host.owner_user_id',
                    to:   'user.id'
                },
                modify:     function (qb) {
                    qb.where('user.is_deleted', 0);
                    qb.omit(['id', 'created_on', 'modified_on', 'is_deleted', 'email', 'roles']);
                }
            },
            access_list: {
                relation:   Model.HasOneRelation,
                modelClass: AccessList,
                join:       {
                    from: 'proxy_host.access_list_id',
                    to:   'access_list.id'
                },
                modify:     function (qb) {
                    qb.where('access_list.is_deleted', 0);
                    qb.omit(['id', 'created_on', 'modified_on', 'is_deleted']);
                }
            }
        };
    }
}

module.exports = ProxyHost;