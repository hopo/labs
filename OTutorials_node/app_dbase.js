var express=require('express');
var jade=require('jade');
var bodyParser=require('body-parser');
var orientDB=require('orientjs');

var app=express();
var server=orientDB({
	host:'127.0.0.1',
	port:2424,
	user:'root',
	password:''
});
var db=server.use('o2');

app.set('views','./views_dbase');
app.set('view engine','jade');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended:false}));

app.listen(3000,function(){
	console.log(' * Connected to port 3000 * ');
});
app.get('/',function(req,res){
	res.redirect('/dbase');
});
app.get('/dbase',function(req,res){
	var sql='SELECT FROM `dbase`';
	db.query(sql).then(function(results){
		res.render('read',{_dbase:results});
	});
});
app.get('/dbase/create',function(req,res){
	var sql='SELECT FROM `dbase`';
	db.query(sql).then(function(results){
		res.render('create',{_dbase:results});
	});
});
app.post('/dbase/create',function(req,res){
	var title=req.body.title_;
	var descr=req.body.descr_;
	var sql='INSERT INTO `dbase` (title,description) VALUES(:t,:d)';
	db.query(sql,{params:{
			t:title,
			d:descr
		}
	}).then(function(results){
		res.redirect('/dbase/'+title);
	});
});
app.get('/dbase/:title',function(req,res){
	var sql='SELECT FROM `dbase`';
	db.query(sql).then(function(results){
		var title=req.params.title;
		var sql2='SELECT FROM `dbase` WHERE `title`=:t';
		db.query(sql2,{params:{
				t:title
			}
		}).then(function(results2){
			console.log(results2);
			res.render('read',{_dbase:results,_dbase2:results2[0]});
		});
	});
});
app.get('/dbase/:title/update',function(req,res){
	var sql='SELECT FROM `dbase`';
	db.query(sql).then(function(results){
		var title=req.params.title;
		var sql2='SELECT FROM `dbase` WHERE `title`=:t';
		db.query(sql2,{params:{
				t:title
			}
		}).then(function(results2){
			console.log(results2);
			res.render('update',{_dbase:results,_dbase2:results2[0]});
		});
	});
});
app.post('/dbase/:id/update',function(req,res){
	var id=req.params.id;
	var title=req.body.title_;
	var descr=req.body.descr_;
	var sql='UPDATE `dbase` SET title=:t,description=:d WHERE @rid=:rid';
	db.query(sql).then(function(results){
		db.query(sql,{params:{
				t:title,
				d:descr,
				rid:id
			}
		}).then(function(results2){
			res.redirect('/dbase/'+title);
		});
	});
});
app.get('/dbase/:title/delete',function(req,res){
	var sql='SELECT FROM `dbase`';
	db.query(sql).then(function(results){
		var title=req.params.title;
		var sql2='SELECT FROM `dbase` WHERE `title`=:t';
		db.query(sql2,{params:{
				t:title
			}
		}).then(function(results2){
			console.log(results2);
			res.render('delete',{_dbase:results,_dbase2:results2[0]});
		});
	});
});
app.post('/dbase/:id/delete',function(req,res){
	var id=req.params.id;
	var sql='DELETE FROM `dbase` WHERE @rid=:rid';
	db.query(sql,{params:{
			rid:id
		}
	}).then(function(results){
		console.log(results);
		res.redirect('/dbase');		
	});
}); 
