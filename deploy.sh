#!/bin/bash

# Deploy Firebase Cloud Functions
firebase deploy --only functions

# Deploy Firebase Hosting
firebase deploy --only hosting
