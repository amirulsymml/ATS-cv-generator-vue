<script setup lang="ts">
import type { CVData } from "../composables/types";

interface Props {
  form: CVData;
}

interface Emits {
  addJob: [];
  removeJob: [index: number];
  addBullet: [index: number];
  removeBullet: [jobIndex: number, bulletIndex: number];
  addEdu: [];
  removeEdu: [index: number];
  addSkill: [];
  removeSkill: [index: number];
  addCert: [];
  removeCert: [index: number];
  addRef: [];
  removeRef: [index: number];
  printPDF: [];
  downloadDOCX: [];
  clearAll: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const MAX_REFEREES = 4;
</script>

<template>
  <div class="sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <h1>ATS CV Generator</h1>
      <p>Fill in your details — preview updates live on the right.</p>
    </div>

    <!-- Form -->
    <div class="form-body">
      <!-- Personal Information -->
      <section aria-labelledby="section-personal">
        <div class="sec-hdr">Personal Information</div>

        <div class="field">
          <label>Full Name</label>
          <input
            id="field-name"
            v-model="props.form.name"
            placeholder="Your Full Name"
          />
        </div>

        <div class="two-grid">
          <div class="field">
            <label>Phone</label>
            <input
              id="field-phone"
              v-model="props.form.phone"
              placeholder="+60 12-345 6789"
            />
          </div>
          <div class="field">
            <label>Email</label>
            <input
              id="field-email"
              v-model="props.form.email"
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div class="two-grid">
          <div class="field">
            <label>City, State</label>
            <input
              id="field-city"
              v-model="props.form.city"
              placeholder="City, State"
            />
          </div>
          <div class="field">
            <label>LinkedIn URL</label>
            <input
              id="field-linkedin"
              v-model="props.form.linkedin"
              placeholder="linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </section>

      <!-- Professional Summary -->
      <section aria-labelledby="section-summary">
        <div class="sec-hdr">Professional Summary</div>

        <div class="field">
          <label>Summary (2–3 sentences, keyword-rich)</label>
          <textarea
            id="field-summary"
            v-model="props.form.summary"
            placeholder="Experienced professional with X years in..."
          />
        </div>
      </section>

      <!-- Work Experience  -->
      <section aria-labelledby="section-experience">
        <div class="sec-hdr">Work Experience</div>
        <div
          v-for="(job, jobIdx) in props.form.jobs"
          :key="`job-${jobIdx}`"
          class="entry-card"
        >
          <div class="entry-card-top">
            <span>Experience {{ jobIdx + 1 }}</span>
            <button
              v-if="props.form.jobs.length > 1"
              class="rm-btn"
              type="button"
              :aria-label="`Remove experience ${jobIdx + 1}`"
              @click="$emit('removeJob', jobIdx)"
            >
              Remove
            </button>
          </div>

          <div class="two-grid">
            <div class="field">
              <label :for="`job-title-${jobIdx}`">Job Title</label>
              <input
                :id="`job-title-${jobIdx}`"
                v-model="job.title"
                placeholder="Admin Executive"
              />
            </div>
            <div class="field">
              <label :for="`job-company-${jobIdx}`">Company Name</label>
              <input
                :id="`job-company-${jobIdx}`"
                v-model="job.company"
                placeholder="Company Sdn Bhd"
              />
            </div>
          </div>

          <div class="three-grid">
            <div class="field">
              <label :for="`job-location-${jobIdx}`">Location</label>
              <input
                :id="`job-location-${jobIdx}`"
                v-model="job.location"
                placeholder="City, State"
              />
            </div>
            <div class="field">
              <label :for="`job-from-${jobIdx}`">From</label>
              <input
                :id="`job-from-${jobIdx}`"
                v-model="job.from"
                placeholder="Jan 2022"
              />
            </div>
            <div class="field">
              <label :for="`job-to-${jobIdx}`">To</label>
              <input
                :id="`job-to-${jobIdx}`"
                v-model="job.to"
                placeholder="Present"
              />
            </div>
          </div>

          <div class="field">
            <label>Bullet Points</label>
            <div
              v-for="(_, bulletIndex) in job.bullets"
              :key="`bullet-${jobIdx}-${bulletIndex}`"
              class="bullet-row"
            >
              <div class="bullet-dot" aria-hidden="true" />
              <input
                v-model="job.bullets[bulletIndex]"
                :aria-label="`Job ${jobIdx + 1} bullet point ${bulletIndex + 1}`"
                placeholder="Achievement with action verbs + metrics..."
              />
              <button
                v-if="job.bullets.length > 1"
                class="rm-btn"
                type="button"
                :aria-label="`Remove bullet point ${bulletIndex + 1} from experience ${jobIdx + 1}`"
                @click="$emit('removeBullet', jobIdx, bulletIndex)"
                style="padding: 3px 7px"
              >
                ✕
              </button>
            </div>
            <button
              v-if="job.bullets.length > 1"
              class="add-btn"
              type="button"
              @click="$emit('addBullet', jobIdx)"
              style="margin-top: 4px"
            >
              + Add bullet point
            </button>
          </div>
        </div>

        <button class="add-btn" type="button" @click="$emit('addJob')">
          + Add work experience
        </button>
      </section>

      <!-- Education -->
      <section aria-labelledby="section-education">
        <div class="sec-hdr">Education</div>
        <div
          v-for="(edu, eduIdx) in props.form.educations"
          :key="`edu-${eduIdx}`"
          class="entry-card"
        >
          <div class="entry-card-top">
            <span>Education {{ eduIdx + 1 }}</span>
            <button
              v-if="props.form.educations.length > 1"
              class="rm-btn"
              type="button"
              @click="$emit('removeEdu', eduIdx)"
            >
              Remove
            </button>
          </div>

          <div class="field">
            <label>Degree / Qualification</label>
            <input
              :id="`edu-degree-${eduIdx}`"
              v-model="edu.degree"
              placeholder="Bachelor of Economics"
            />
          </div>

          <div class="two-grid">
            <div class="field">
              <label>Institution Name</label>
              <input
                :id="`edu-school-${eduIdx}`"
                v-model="edu.school"
                placeholder="Universiti ..."
              />
            </div>
            <div class="field">
              <label>Location</label>
              <input
                :id="`edu-location-${eduIdx}`"
                v-model="edu.location"
                placeholder="City, State"
              />
            </div>
          </div>

          <div class="two-grid">
            <div class="field">
              <label>Year From</label>
              <input
                :id="`edu-from-${eduIdx}`"
                v-model="edu.from"
                placeholder="2018"
              />
            </div>
            <div class="field">
              <label>Year To</label>
              <input
                :id="`edu-to-${eduIdx}`"
                v-model="edu.to"
                placeholder="2022"
              />
            </div>
          </div>
        </div>
        <button class="add-btn" type="button" @click="$emit('addEdu')">
          + Add education
        </button>
      </section>

      <!-- Technical Skills -->
      <section aria-labelledby="section-skills">
        <div class="sec-hdr">Technical Skills</div>

        <div style="display: flex; gap: 6px; margin-bottom: 6px">
          <span
            style="
              font-size: 10.5px;
              color: var(--text-muted);
              width: 155px;
              flex-shrink: 0;
              padding: 3px 0;
            "
            >Category label</span
          >
          <span
            style="font-size: 10.5px; color: var(--text-muted); padding: 3px 0"
            >Skills (comma-separated)</span
          >
        </div>

        <div
          v-for="(skill, skillIdx) in props.form.skills"
          :key="'skill-' + skillIdx"
          class="skill-row"
        >
          <input
            class="sk-lbl"
            v-model="skill.label"
            :aria-label="`Skill category ${skillIdx + 1} label`"
            placeholder="e.g. Microsoft Office"
          />
          <input
            class="sk-val"
            v-model="skill.values"
            :aria-label="`Skill category ${skillIdx + 1} label`"
            placeholder="Word, Excel, PowerPoint"
          />
          <button
            v-if="props.form.skills.length > 1"
            class="rm-btn"
            type="button"
            :aria-label="`Remove skill category ${skillIdx + 1}`"
            @click="$emit('removeSkill', skillIdx)"
            style="padding: 3px 7px"
          >
            ✕
          </button>
        </div>
        <button class="add-btn" type="button" @click="$emit('addSkill')">
          + Add skill category
        </button>
      </section>

      <!-- Certifications & Training -->
      <section aria-labelledby="section-certs">
        <div class="sec-hdr">Certifications &amp; Training</div>

        <div
          v-for="(_, certIdx) in props.form.certifications"
          :key="`cert-${certIdx}`"
          class="bullet-row"
          style="margin-bottom: 6px"
        >
          <div class="bullet-dot"></div>
          <input
            v-model="props.form.certifications[certIdx]"
            placeholder="e.g. AWS Certified Solutions Architect – Amazon (2023)"
          />
          <button
            v-if="props.form.certifications.length > 1"
            class="rm-btn"
            type="button"
            @click="$emit('removeCert', certIdx)"
            style="padding: 3px 7px"
          >
            ✕
          </button>
        </div>
        <button class="add-btn" type="button" @click="$emit('addCert')">
          + Add certification
        </button>
      </section>

      <!-- Referees -->
      <section aria-labelledby="section-referees">
        <div class="sec-hdr">Referees</div>

        <div
          v-for="(ref, refIdx) in props.form.referees"
          :key="`ref-${refIdx}`"
          class="entry-card"
        >
          <div class="entry-card-top">
            <span>Referee {{ refIdx + 1 }}</span>
            <button
              v-if="props.form.referees.length > 1"
              class="rm-btn"
              type="button"
              @click="$emit('removeRef', refIdx)"
            >
              Remove
            </button>
          </div>

          <div class="two-grid">
            <div class="field">
              <label>Full Name</label>
              <input v-model="ref.name" placeholder="Reference Name" />
            </div>
            <div class="field">
              <label>Phone</label>
              <input v-model="ref.phone" placeholder="+60 12-000 0000" />
            </div>
          </div>

          <div class="field">
            <label>Title &amp; Organisation</label>
            <input
              v-model="ref.role"
              placeholder="Head of Engineering, Tech Company Sdn Bhd"
            />
          </div>
        </div>

        <button
          v-if="props.form.referees.length < MAX_REFEREES"
          class="add-btn"
          type="button"
          @click="$emit('addRef')"
        >
          + Add referee (max {{ MAX_REFEREES }})
        </button>
      </section>
    </div>
    <!-- ── Footer ── -->
    <footer class="sidebar-footer">
      <div class="footer-btns">
        <!-- <button class="btn-primary" type="button" @click="emit('printPDF')">
          <i class="fa-regular fa-file-pdf" aria-hidden="true" />
          Download PDF
        </button> -->

        <button
          class="btn-primary btn-docx"
          type="button"
          @click="emit('downloadDOCX')"
        >
          <i class="fa-regular fa-file-word" aria-hidden="true" />
          Download DOCX
        </button>

        <button class="btn-secondary" type="button" @click="emit('clearAll')">
          Clear
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import "../styles/sidebar.css";
</style>
