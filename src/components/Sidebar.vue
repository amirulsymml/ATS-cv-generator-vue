<script setup lang="ts">
import type { CVFormData } from '../composables/useCVForm'

interface Props {
  form: CVFormData
}

interface Emits {
  addJob: []
  removeJob: [index: number]
  addBullet: [index: number]
  removeBullet: [jobIndex: number, bulletIndex: number]
  addEdu: []
  removeEdu: [index: number]
  addSkill: []
  removeSkill: [index: number]
  addCert: []
  removeCert: [index: number]
  addRef: []
  removeRef: [index: number]
  printPDF: []
  downloadDOCX: []
  clearAll: []
}

withDefaults(defineProps<Props>(), {})
defineEmits<Emits>()
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1>ATS CV Generator</h1>
      <p>Fill in your details &mdash; preview updates live on the right.</p>
    </div>
    <div class="form-body">
      <div class="sec-hdr">Personal Information</div>
      <div class="field">
        <label>Full Name</label>
        <input v-model="form.name" placeholder="e.g. Ahmad Faris bin Abdullah" />
      </div>
      <div class="two">
        <div class="field">
          <label>Phone</label>
          <input v-model="form.phone" placeholder="+60 12-345 6789" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" placeholder="you@email.com" />
        </div>
      </div>
      <div class="two">
        <div class="field">
          <label>City, State</label>
          <input v-model="form.city" placeholder="Kuching, Sarawak" />
        </div>
        <div class="field">
          <label>LinkedIn URL</label>
          <input v-model="form.linkedin" placeholder="linkedin.com/in/yourprofile" />
        </div>
      </div>

      <div class="sec-hdr">Professional Summary</div>
      <div class="field">
        <label>Summary (2–3 sentences, keyword-rich)</label>
        <textarea v-model="form.summary" placeholder="Experienced professional with X years in..."></textarea>
      </div>

      <div class="sec-hdr">Work Experience</div>
      <div v-for="(job, i) in form.jobs" :key="'job-' + i" class="entry-card">
        <div class="entry-card-top">
          <span>Experience {{ i + 1 }}</span>
          <button v-if="form.jobs.length > 1" class="rm-btn" @click="$emit('removeJob', i)">Remove</button>
        </div>
        <div class="two">
          <div class="field">
            <label>Job Title</label>
            <input v-model="job.title" placeholder="Software Engineer" />
          </div>
          <div class="field">
            <label>Company Name</label>
            <input v-model="job.company" placeholder="Company Sdn Bhd" />
          </div>
        </div>
        <div class="three">
          <div class="field">
            <label>Location</label>
            <input v-model="job.location" placeholder="Kuching, Sarawak" />
          </div>
          <div class="field">
            <label>From</label>
            <input v-model="job.from" placeholder="Jan 2022" />
          </div>
          <div class="field">
            <label>To</label>
            <input v-model="job.to" placeholder="Present" />
          </div>
        </div>
        <div class="field">
          <label>Bullet Points</label>
          <div v-for="(_, bi) in job.bullets" :key="'bullet-' + i + '-' + bi" class="bullet-row">
            <div class="bullet-dot"></div>
            <input v-model="job.bullets[bi]" placeholder="Achievement with action verbs + metrics..." />
            <button v-if="job.bullets.length > 1" class="rm-btn" @click="$emit('removeBullet', i, bi)" style="padding: 3px 7px">✕</button>
          </div>
          <button class="add-btn" @click="$emit('addBullet', i)" style="margin-top: 4px">+ Add bullet point</button>
        </div>
      </div>
      <button class="add-btn" @click="$emit('addJob')">+ Add work experience</button>

      <div class="sec-hdr">Education</div>
      <div v-for="(edu, i) in form.edus" :key="'edu-' + i" class="entry-card">
        <div class="entry-card-top">
          <span>Education {{ i + 1 }}</span>
          <button v-if="form.edus.length > 1" class="rm-btn" @click="$emit('removeEdu', i)">Remove</button>
        </div>
        <div class="field">
          <label>Degree / Qualification</label>
          <input v-model="edu.degree" placeholder="Bachelor of Computer Science" />
        </div>
        <div class="two">
          <div class="field">
            <label>Institution Name</label>
            <input v-model="edu.school" placeholder="Universiti Malaysia Sarawak" />
          </div>
          <div class="field">
            <label>Location</label>
            <input v-model="edu.location" placeholder="Kota Samarahan, Sarawak" />
          </div>
        </div>
        <div class="two">
          <div class="field">
            <label>Year From</label>
            <input v-model="edu.from" placeholder="2018" />
          </div>
          <div class="field">
            <label>Year To</label>
            <input v-model="edu.to" placeholder="2022" />
          </div>
        </div>
      </div>
      <button class="add-btn" @click="$emit('addEdu')">+ Add education</button>

      <div class="sec-hdr">Technical Skills</div>
      <div style="display: flex; gap: 6px; margin-bottom: 6px">
        <span style="font-size: 10.5px; color: var(--text-muted); width: 155px; flex-shrink: 0; padding: 3px 0">Category label</span>
        <span style="font-size: 10.5px; color: var(--text-muted); padding: 3px 0">Skills (comma-separated)</span>
      </div>
      <div v-for="(skill, i) in form.skills" :key="'skill-' + i" class="skill-row">
        <input class="sk-lbl" v-model="skill.label" placeholder="e.g. Programming Languages" />
        <input class="sk-val" v-model="skill.values" placeholder="Python, JavaScript, SQL..." />
        <button v-if="form.skills.length > 1" class="rm-btn" @click="$emit('removeSkill', i)" style="padding: 3px 7px">✕</button>
      </div>
      <button class="add-btn" @click="$emit('addSkill')">+ Add skill category</button>

      <div class="sec-hdr">Certifications &amp; Training</div>
      <div v-for="(_, i) in form.certs" :key="'cert-' + i" class="bullet-row" style="margin-bottom: 6px">
        <div class="bullet-dot"></div>
        <input v-model="form.certs[i]" placeholder="e.g. AWS Certified Solutions Architect – Amazon (2023)" />
        <button v-if="form.certs.length > 1" class="rm-btn" @click="$emit('removeCert', i)" style="padding: 3px 7px">✕</button>
      </div>
      <button class="add-btn" @click="$emit('addCert')">+ Add certification</button>

      <div class="sec-hdr">Referees</div>
      <div v-for="(ref, i) in form.refs" :key="'ref-' + i" class="entry-card">
        <div class="entry-card-top">
          <span>Referee {{ i + 1 }}</span>
          <button v-if="form.refs.length > 1" class="rm-btn" @click="$emit('removeRef', i)">Remove</button>
        </div>
        <div class="two">
          <div class="field">
            <label>Full Name</label>
            <input v-model="ref.name" placeholder="Dr. Lim Wei Seng" />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="ref.phone" placeholder="+60 12-000 0000" />
          </div>
        </div>
        <div class="field">
          <label>Title &amp; Organisation</label>
          <input v-model="ref.role" placeholder="Head of Engineering, Tech Company Sdn Bhd" />
        </div>
      </div>
      <button class="add-btn" v-if="form.refs.length < 4" @click="$emit('addRef')">+ Add referee (max 4)</button>
    </div>

    <div class="sidebar-footer">
      <div class="footer-btns">
        <button class="btn-primary" @click="$emit('printPDF')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Download PDF
        </button>
        <button class="btn-primary btn-docx" @click="$emit('downloadDOCX')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
          Download DOCX
        </button>
        <button class="btn-secondary" @click="$emit('clearAll')">Clear</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/sidebar.css';
</style>
