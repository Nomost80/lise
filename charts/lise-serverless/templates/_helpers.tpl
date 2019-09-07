{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "lise-serverless.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "lise-serverless.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "lise-serverless.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "lise-serverless.labels" -}}
app.kubernetes.io/name: {{ include "lise-serverless.name" . }}
helm.sh/chart: {{ include "lise-serverless.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "call-nested" -}}
{{- $dot := index . 0 -}}
{{- $subchart := index . 1 -}}
{{- $template := index . 2 -}}
{{- include $template (dict "Chart" (dict "Name" $subchart) "Values" (index $dot.Values $subchart) "Release" $dot.Release "Capabilities" $dot.Capabilities) -}}
{{- end -}}

{{- define "kafka.endpoint" -}}
{{- $kafkaName := include "call-nested" (list . "kafka" "kafka.fullname") -}}
{{- $kafkaPort := 9092 -}}
{{- if .Values.kafka.service -}}{{ if .Values.kafka.service.port -}}
 $kafkaName := .Values.kafka.service.port
{{- end -}}{{- end -}}
{{- printf "%s-%s.%s.%s:%s" $kafkaName "headless" .Release.Namespace "svc.cluster.local" ($kafkaPort | toString) -}}
{{- end -}}