export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          display_name: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_ja: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_ja?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_ja?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          author_role: string
          category_id: string
          content: string[]
          cover_media_id: string | null
          created_at: string
          excerpt: string
          id: string
          published_at: string
          read_minutes: number
          slug: string
          title: string
          updated_at: string
          visual_seed: string
        }
        Insert: {
          author: string
          author_role: string
          category_id: string
          content?: string[]
          cover_media_id?: string | null
          created_at?: string
          excerpt: string
          id?: string
          published_at?: string
          read_minutes?: number
          slug: string
          title: string
          updated_at?: string
          visual_seed: string
        }
        Update: {
          author?: string
          author_role?: string
          category_id?: string
          content?: string[]
          cover_media_id?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string
          read_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
          visual_seed?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          customer_id: string | null
          email: string
          id: string
          message: string
          name: string
          status: Database["public"]["Enums"]["message_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: Database["public"]["Enums"]["message_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipment_categories: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description_en: string
          description_ja: string | null
          id: string
          name_en: string
          name_ja: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description_en: string
          description_ja?: string | null
          id?: string
          name_en: string
          name_ja?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description_en?: string
          description_ja?: string | null
          id?: string
          name_en?: string
          name_ja?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_categories_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_images: {
        Row: {
          equipment_item_id: string
          media_id: string
          sort_order: number
        }
        Insert: {
          equipment_item_id: string
          media_id: string
          sort_order?: number
        }
        Update: {
          equipment_item_id?: string
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipment_images_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_images_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_items: {
        Row: {
          applications_en: string[]
          applications_ja: string[]
          availability: Database["public"]["Enums"]["equipment_availability"]
          category_id: string
          created_at: string
          description_en: string
          description_ja: string | null
          id: string
          name_en: string
          name_ja: string | null
          slug: string
          specs_en: Json
          specs_ja: Json
          summary_en: string
          summary_ja: string | null
          updated_at: string
          visual_seed: string
        }
        Insert: {
          applications_en?: string[]
          applications_ja?: string[]
          availability?: Database["public"]["Enums"]["equipment_availability"]
          category_id: string
          created_at?: string
          description_en: string
          description_ja?: string | null
          id?: string
          name_en: string
          name_ja?: string | null
          slug: string
          specs_en?: Json
          specs_ja?: Json
          summary_en: string
          summary_ja?: string | null
          updated_at?: string
          visual_seed: string
        }
        Update: {
          applications_en?: string[]
          applications_ja?: string[]
          availability?: Database["public"]["Enums"]["equipment_availability"]
          category_id?: string
          created_at?: string
          description_en?: string
          description_ja?: string | null
          id?: string
          name_en?: string
          name_ja?: string | null
          slug?: string
          specs_en?: Json
          specs_ja?: Json
          summary_en?: string
          summary_ja?: string | null
          updated_at?: string
          visual_seed?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "equipment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_related_items: {
        Row: {
          equipment_item_id: string
          related_item_id: string
          sort_order: number
        }
        Insert: {
          equipment_item_id: string
          related_item_id: string
          sort_order?: number
        }
        Update: {
          equipment_item_id?: string
          related_item_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipment_related_items_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_related_items_related_item_id_fkey"
            columns: ["related_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer_en: string
          answer_ja: string | null
          category: Database["public"]["Enums"]["faq_category"] | null
          created_at: string
          id: string
          question_en: string
          question_ja: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          answer_en: string
          answer_ja?: string | null
          category?: Database["public"]["Enums"]["faq_category"] | null
          created_at?: string
          id?: string
          question_en: string
          question_ja?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_ja?: string | null
          category?: Database["public"]["Enums"]["faq_category"] | null
          created_at?: string
          id?: string
          question_en?: string
          question_ja?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          description_en: string
          description_ja: string | null
          id: string
          name_en: string
          name_ja: string | null
          slug: string
          updated_at: string
          use_cases_en: string[]
          use_cases_ja: string[]
        }
        Insert: {
          created_at?: string
          description_en: string
          description_ja?: string | null
          id?: string
          name_en: string
          name_ja?: string | null
          slug: string
          updated_at?: string
          use_cases_en?: string[]
          use_cases_ja?: string[]
        }
        Update: {
          created_at?: string
          description_en?: string
          description_ja?: string | null
          id?: string
          name_en?: string
          name_ja?: string | null
          slug?: string
          updated_at?: string
          use_cases_en?: string[]
          use_cases_ja?: string[]
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          height: number | null
          id: string
          mime_type: string
          size_bytes: number | null
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          height?: number | null
          id?: string
          mime_type: string
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          height?: number | null
          id?: string
          mime_type?: string
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_equipment: {
        Row: {
          equipment_item_id: string
          project_id: string
          sort_order: number
        }
        Insert: {
          equipment_item_id: string
          project_id: string
          sort_order?: number
        }
        Update: {
          equipment_item_id?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_equipment_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_equipment_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          media_id: string
          project_id: string
          sort_order: number
        }
        Insert: {
          media_id: string
          project_id: string
          sort_order?: number
        }
        Update: {
          media_id?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          project_id: string
          service_id: string
          sort_order: number
        }
        Insert: {
          project_id: string
          service_id: string
          sort_order?: number
        }
        Update: {
          project_id?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: Database["public"]["Enums"]["project_category"]
          client: string
          created_at: string
          description: string[]
          id: string
          location: string
          slug: string
          stats: Json
          summary: string
          title: string
          updated_at: string
          visual_seed: string
          year: number
        }
        Insert: {
          category: Database["public"]["Enums"]["project_category"]
          client: string
          created_at?: string
          description?: string[]
          id?: string
          location: string
          slug: string
          stats?: Json
          summary: string
          title: string
          updated_at?: string
          visual_seed: string
          year: number
        }
        Update: {
          category?: Database["public"]["Enums"]["project_category"]
          client?: string
          created_at?: string
          description?: string[]
          id?: string
          location?: string
          slug?: string
          stats?: Json
          summary?: string
          title?: string
          updated_at?: string
          visual_seed?: string
          year?: number
        }
        Relationships: []
      }
      quote_request_attachments: {
        Row: {
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          quote_request_id: string
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          quote_request_id: string
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          quote_request_id?: string
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_request_attachments_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          attendees: number | null
          budget: string | null
          city: string
          company: string
          country: string
          created_at: string
          customer_id: string | null
          email: string
          event_date: string | null
          event_type: string
          id: string
          name: string
          notes: string | null
          phone: string
          requested_services: string[]
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
          venue: string | null
        }
        Insert: {
          attendees?: number | null
          budget?: string | null
          city: string
          company: string
          country: string
          created_at?: string
          customer_id?: string | null
          email: string
          event_date?: string | null
          event_type: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          requested_services?: string[]
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          venue?: string | null
        }
        Update: {
          attendees?: number | null
          budget?: string | null
          city?: string
          company?: string
          country?: string
          created_at?: string
          customer_id?: string | null
          email?: string
          event_date?: string | null
          event_type?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          requested_services?: string[]
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_faqs: {
        Row: {
          faq_id: string
          service_id: string
          sort_order: number
        }
        Insert: {
          faq_id: string
          service_id: string
          sort_order?: number
        }
        Update: {
          faq_id?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_faqs_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_faqs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_related_equipment_categories: {
        Row: {
          equipment_category_id: string
          service_id: string
          sort_order: number
        }
        Insert: {
          equipment_category_id: string
          service_id: string
          sort_order?: number
        }
        Update: {
          equipment_category_id?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_related_equipment_categories_equipment_category_id_fkey"
            columns: ["equipment_category_id"]
            isOneToOne: false
            referencedRelation: "equipment_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_related_equipment_categories_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_related_services: {
        Row: {
          related_service_id: string
          service_id: string
          sort_order: number
        }
        Insert: {
          related_service_id: string
          service_id: string
          sort_order?: number
        }
        Update: {
          related_service_id?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_related_services_related_service_id_fkey"
            columns: ["related_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_related_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          capabilities_en: string[]
          capabilities_ja: string[]
          category: Database["public"]["Enums"]["service_category"]
          cover_media_id: string | null
          created_at: string
          hero_statement_en: string
          hero_statement_ja: string | null
          id: string
          ideal_for_en: string[]
          ideal_for_ja: string[]
          name_en: string
          name_ja: string | null
          overview_en: string[]
          overview_ja: string[]
          process_en: Json
          process_ja: Json
          seo_description_en: string
          seo_description_ja: string | null
          seo_title_en: string
          seo_title_ja: string | null
          short_description_en: string
          short_description_ja: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          capabilities_en?: string[]
          capabilities_ja?: string[]
          category: Database["public"]["Enums"]["service_category"]
          cover_media_id?: string | null
          created_at?: string
          hero_statement_en: string
          hero_statement_ja?: string | null
          id?: string
          ideal_for_en?: string[]
          ideal_for_ja?: string[]
          name_en: string
          name_ja?: string | null
          overview_en?: string[]
          overview_ja?: string[]
          process_en?: Json
          process_ja?: Json
          seo_description_en: string
          seo_description_ja?: string | null
          seo_title_en: string
          seo_title_ja?: string | null
          short_description_en: string
          short_description_ja?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          capabilities_en?: string[]
          capabilities_ja?: string[]
          category?: Database["public"]["Enums"]["service_category"]
          cover_media_id?: string | null
          created_at?: string
          hero_statement_en?: string
          hero_statement_ja?: string | null
          id?: string
          ideal_for_en?: string[]
          ideal_for_ja?: string[]
          name_en?: string
          name_ja?: string | null
          overview_en?: string[]
          overview_ja?: string[]
          process_en?: Json
          process_ja?: Json
          seo_description_en?: string
          seo_description_ja?: string | null
          seo_title_en?: string
          seo_title_ja?: string | null
          short_description_en?: string
          short_description_ja?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      solution_services: {
        Row: {
          service_id: string
          solution_id: string
          sort_order: number
        }
        Insert: {
          service_id: string
          solution_id: string
          sort_order?: number
        }
        Update: {
          service_id?: string
          solution_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "solution_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_services_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          cover_media_id: string | null
          created_at: string
          hero_statement_en: string
          hero_statement_ja: string | null
          highlights_en: Json
          highlights_ja: Json
          id: string
          name_en: string
          name_ja: string | null
          overview_en: string[]
          overview_ja: string[]
          seo_description_en: string
          seo_description_ja: string | null
          seo_title_en: string
          seo_title_ja: string | null
          short_description_en: string
          short_description_ja: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          hero_statement_en: string
          hero_statement_ja?: string | null
          highlights_en?: Json
          highlights_ja?: Json
          id?: string
          name_en: string
          name_ja?: string | null
          overview_en?: string[]
          overview_ja?: string[]
          seo_description_en: string
          seo_description_ja?: string | null
          seo_title_en: string
          seo_title_ja?: string | null
          short_description_en: string
          short_description_ja?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          hero_statement_en?: string
          hero_statement_ja?: string | null
          highlights_en?: Json
          highlights_ja?: Json
          id?: string
          name_en?: string
          name_ja?: string | null
          overview_en?: string[]
          overview_ja?: string[]
          seo_description_en?: string
          seo_description_ja?: string | null
          seo_title_en?: string
          seo_title_ja?: string | null
          short_description_en?: string
          short_description_ja?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solutions_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author: string
          company: string
          created_at: string
          id: string
          is_published: boolean
          quote: string
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author: string
          company: string
          created_at?: string
          id?: string
          is_published?: boolean
          quote: string
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          company?: string
          created_at?: string
          id?: string
          is_published?: boolean
          quote?: string
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      admin_role: "admin" | "editor"
      equipment_availability: "in-stock" | "limited" | "made-to-order"
      faq_category:
        | "general"
        | "quotes-pricing"
        | "equipment"
        | "planning"
        | "technical"
      message_status: "new" | "read" | "archived"
      project_category:
        | "Conference"
        | "Corporate"
        | "Exhibition"
        | "Hybrid"
        | "Virtual"
        | "Outdoor"
      quote_status: "new" | "in_review" | "quoted" | "won" | "lost" | "archived"
      service_category: "event-type" | "technical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      admin_role: ["admin", "editor"],
      equipment_availability: ["in-stock", "limited", "made-to-order"],
      faq_category: [
        "general",
        "quotes-pricing",
        "equipment",
        "planning",
        "technical",
      ],
      message_status: ["new", "read", "archived"],
      project_category: [
        "Conference",
        "Corporate",
        "Exhibition",
        "Hybrid",
        "Virtual",
        "Outdoor",
      ],
      quote_status: ["new", "in_review", "quoted", "won", "lost", "archived"],
      service_category: ["event-type", "technical"],
    },
  },
} as const
