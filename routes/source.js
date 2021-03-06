var htmlEncode = require('node-htmlencode').htmlEncode;
var getHeaderInfo = require('../utils');

/* GET a source listing. */
function sourceRouter(req, res, next) {
    res.locals = getHeaderInfo(req) || {};
    var dbName = req.params.dbName;
    var sourceId = req.params.id;
    var pool = require('../db-config').createConnection(dbName);

    pool.acquire(function(err, conn) {
        if (err) {
            console.error(err);
            next(err);
        }

        var sources = [];

        var sql = `select 'individual' as stype, i.indi, i.lname, i.fname, a.text, b.*
            from sourtxt a, sour b, indi i
            where a.sourid=b.sour and a.refid=i.indi and a.seq=?
            UNION ALL
            select 'family' as stype, i.indi, i.lname, i.fname, a.text, b.*
            from sourtxt a, sour b, fami f, indi i
            where a.refid=f.fami and a.sourid=b.sour and i.indi in (f.husb, f.wife)
                and a.seq=? `;

        conn.query(sql, [sourceId, sourceId], function(err, results) {
            if (err) {
                console.error(err);
                next(err);
            }

            results.rows.forEach(function(r) {
                sources.push({
                    stype: r.stype,
                    indi: r.INDI,
                    name: r.LNAME + ', ' + r.FNAME,
                    text: htmlEncode(r.TEXT),
                    titl: htmlEncode(r.TITL),
                    auth: htmlEncode(r.AUTH),
                    publ: htmlEncode(r.PUBL),
                    repo: htmlEncode(r.REPO)
                });
            });

            pool.release(conn);
            res.locals['sources'] = sources;
            res.render('source');
        });
        pool.close();
    });
};

module.exports = sourceRouter;

