'use strict';


module.exports = function (app) {

  const express = require('express');
  const cors = require('cors');
  const mongoose = require('mongoose');
  mongoose.connect("mongodb+srv://dbuser2:uuuth@cluster0.uk2xzib.mongodb.net/issuetracker?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  const issueSchema = new mongoose.Schema({
    project: { type: String },
    issue_title: { type: String },
    issue_text: { type: String },
    created_on: { type: Date },
    updated_on: { type: Date },
    created_by: { type: String },
    assigned_to: { type: String },
    open: { type: Boolean },
    status_text: { type: String }
  });
  const Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')
    .get(async function (req, res) {
      try {
        let query = { project: req.params.project };

        if (req.query._id) query._id = req.query._id;
        if (req.query.issue_title) query.issue_title = req.query.issue_title;
        if (req.query.issue_text) query.issue_text = req.query.issue_text;
        if (req.query.created_on) query.created_on = new Date(req.query.created_on);
        if (req.query.updated_on) query.updated_on = new Date(req.query.updated_on);
        if (req.query.created_by) query.created_by = req.query.created_by;
        if (req.query.assigned_to) query.assigned_to = req.query.assigned_to;
        if (req.query.open) query.open = req.query.open === 'true';
        if (req.query.status_text) query.status_text = req.query.status_text;

        const issues = await Issue.find(query);
        res.send(issues);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    })

    .post(async function (req, res) {
      if (!req.body.issue_title || req.body.issue_title == ""
        || !req.body.issue_text || req.body.issue_text == ""
        || !req.body.created_by || req.body.created_by == "") {
        res.send({ error: 'required field(s) missing' });
        return;
      }
      try {
        const newIssue = new Issue({
          project: req.params.project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || ""
        });
        const savedIssue = await newIssue.save();
        res.send({
          assigned_to: savedIssue.assigned_to,
          status_text: savedIssue.status_text,
          open: savedIssue.open,
          _id: savedIssue._id,
          issue_title: savedIssue.issue_title,
          issue_text: savedIssue.issue_text,
          created_by: savedIssue.created_by,
          created_on: savedIssue.created_on,
          updated_on: savedIssue.updated_on,
        })
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    })

    .put(async function (req, res) {
      if (!req.body._id) {
        res.send({ error: 'missing _id' });
        return;
      }
      if (!(req.body.issue_title && req.body.issue_title != "")
      && !(req.body.issue_text && req.body.issue_text != "")
      && !(req.body.created_by && req.body.created_by != "")
      && !(req.body.assigned_to && req.body.assigned_to != "")
      && !(req.body.open && req.body.open != "")
      && !(req.body.status_text && req.body.status_text != "")) {
        res.send({ error: "no update field(s) sent", _id: req.body._id })
        return;
      }
      try {
        const issue = await Issue.findById(req.body._id);
        if (!issue || !issue._id || issue._id == "") {
          res.send({ error: 'could not update', _id: req.body._id });
          return;
        }
        if (req.body.issue_title && req.body.issue_title != "") {
          issue.issue_title = req.body.issue_title;
        }
        if (req.body.issue_text && req.body.issue_text != "") {
          issue.issue_text = req.body.issue_text;
        }
        if (req.body.created_by && req.body.created_by != "") {
          issue.created_by = req.body.created_by;
        }
        if (req.body.assigned_to && req.body.assigned_to != "") {
          issue.assigned_to = req.body.assigned_to;
        }
        if (req.body.open == true) {
          issue.open = false;
        }
        if (req.body.status_text && req.body.status_text != "") {
          issue.status_text = req.body.status_text;
        }
        issue.updated_on = new Date();
        const updatedIssue = await issue.save();
        res.send({ result: "successfully updated", _id: updatedIssue._id })
      } catch (error) {
        console.error(error);
        res.send({ error: 'could not update', _id: req.body._id });
      }
    })

  app.delete('/api/issues/:project', async (req, res) => {
    try {
      let issueId = req.body._id;

      if (!issueId || issueId == "") {
        return res.json({ error: 'missing _id' });
      }

      const deletedIssue = await Issue.findByIdAndDelete(issueId);

      if (!deletedIssue) {
        return res.json({ error: 'could not delete', _id: issueId });
      }
      res.send({ result: "successfully deleted", _id: deletedIssue._id, })
    } catch (error) {
      console.error(error);
      return res.json({ error: 'could not delete', _id: req.body._id });
    }
  });

};
